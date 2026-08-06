Here is an end-to-end System Design for a secure, high-throughput **File Upload Service** (handling media, PDFs, profile pictures, and documents) designed to offload bandwidth from application servers, prevent malicious uploads, and enforce zero-trust access controls.

---

# 1. System Requirements & Security Objectives

### Functional Requirements

1. **Direct-to-Storage Uploads:** Clients upload files directly to Object Storage (e.g., AWS S3 / Google Cloud Storage) without passing raw binary streams through API application servers.
2. **Access Control:** Secure read access using short-lived signed URLs.
3. **Resumable Uploads:** Support chunked, resumable uploads for large files ($>100\text{ MB}$).
4. **Processing Pipeline:** Asynchronous virus scanning, thumbnail generation, and metadata extraction post-upload.

### Security Objectives

* **Pre-Signed URL Authorization:** Only authenticated users with explicit permissions can generate upload/download grants.
* **Malware & MIME Verification:** Prevent users from executing malicious scripts (e.g., uploading a `.php` or `.exe` disguised as a `.jpg`).
* **Encryption:** Data encrypted **In-Transit** (TLS 1.3) and **At-Rest** (AES-256 / AWS KMS).
* **Least Privilege:** Public access completely blocked at the object storage bucket level.

---

# 2. High-Level Architecture Diagram

```text
                             ┌─────────────────┐
                             │   API Gateway   │
                             │  (Auth Check)   │
                             └────────┬────────┘
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           │ 1. Request Upload URL                               │ 4. Confirm Upload Complete
           ▼                                                     ▼
 ┌────────────────────┐                               ┌────────────────────┐
 │ Application Server │                               │ Application Server │
 │  (Upload Manager)  │                               │  (Upload Manager)  │
 └─────────┬──────────┘                               └─────────┬──────────┘
           │ 2. Issue Pre-Signed URL                            │
           ▼                                                    ▼
 ┌────────────────────┐  3. Upload Binary File Direct ┌────────────────────┐
 │   Client App /     ├──────────────────────────────►│ AWS S3 / GCP GCS   │
 │   Web Browser      │                               │  (Private Bucket)  │
 └────────────────────┘                               └─────────┬──────────┘
                                                                │
                                                                │ 5. S3 Event Trigger
                                                                ▼
                                                      ┌────────────────────┐
                                                      │ SQS / Kafka Event  │
                                                      └─────────┬──────────┘
                                                                │
                                                                ▼
                                                      ┌────────────────────┐
                                                      │ Processing Workers │
                                                      │ (ClamAV / Sharp)   │
                                                      └────────────────────┘

```

---

# 3. Secure Direct Upload Flow (Pre-Signed URLs)

Bypassing application servers for raw uploads saves memory and CPU bandwidth while preventing server starvation.

### Step-by-Step Sequence

```text
Client                App Server               S3 Bucket             Virus / Async Worker
  │                       │                        │                          │
  │─── 1. POST /upload ──►│                        │                          │
  │  (filename, type, sz) │                        │                          │
  │                       │── 2. Generate Presigned│                          │
  │                       │   PUT URL via SDK      │                          │
  │◄── 3. Presigned URL ──│                        │                          │
  │                       │                        │                          │
  │─────────────────────── 4. PUT binary file ────►│                          │
  │                       │                        │                          │
  │─── 5. POST /confirm ─►│                        │                          │
  │                       │                        │── 6. S3 Event Object ───►│
  │                       │                        │   Created Notification   │
  │                       │                        │                          │ Scan / Resize

```

#### Step 1: Pre-Signed URL Request (`POST /api/files/upload-url`)

The client requests an upload authorization token passing filename, size, and client-reported MIME type.

```javascript
// App Server Handler (Node.js/Express)
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3Client = new S3Client({ region: 'us-east-1' });

app.post('/api/files/upload-url', async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;
  const userId = req.user.id;

  // 1. Validation Safeguards
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB limit
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  if (fileSize > MAX_FILE_SIZE) return res.status(400).json({ error: 'File size exceeds limit' });
  if (!ALLOWED_TYPES.includes(fileType)) return res.status(400).json({ error: 'File type not supported' });

  // 2. Generate Random Object Key (Prevents path traversal & file overwrites)
  const fileExtension = fileName.split('.').pop();
  const fileKey = `uploads/temp/${userId}/${crypto.randomUUID()}.${fileExtension}`;

  // 3. Create Presigned URL valid for 15 minutes
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
    Metadata: { userId, originalName: fileName },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  res.json({ uploadUrl, fileKey });
});

```

#### Step 2: Direct Binary Upload

The client sends a `PUT` request directly to the returned `uploadUrl` with the file payload.

---

# 4. Storage & Processing Security Policies

### A. Bucket Hardening Strategy

1. **Block Public Access:** Enforce `BlockPublicAccess: TRUE` on the S3 Bucket policy.
2. **KMS Server-Side Encryption (SSE-KMS):** Encrypt every object using custom customer-managed keys (KMS) so objects cannot be read even if physical storage media is compromised.
3. **CORS Configuration:** Restrict allowed CORS origins strictly to your web domain:

```json
[
  {
    "AllowedHeaders": ["Content-Type"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["https://app.yourdomain.com"],
    "MaxAgeSeconds": 3000
  }
]

```

---

### B. Post-Upload Verification & Malware Scanning (Quarantine Pipeline)

Do **NOT** trust the MIME type or file extension sent by the client browser.

1. **Quarantine Bucket Isolation:**

* Files initially land in a temporary **quarantine bucket** (`uploads/temp/`).

1. **Asynchronous Malware Scanning:**

* S3 emits an `ObjectCreated` event to **AWS SQS / Kafka**.
* Worker instances download the quarantined file stream and run **ClamAV** scanning + magic byte verification (checking true file signatures like `0xFF 0xD8 0xFF` for JPEG).

1. **Promotion or Deletion:**

* **If Clean:** The worker moves the file from `uploads/temp/` to the permanent secure bucket (`uploads/clean/`) and triggers image resizing / PDF thumbnail generation.
* **If Infected / Spoofed:** The worker deletes the file instantly and publishes a security audit alert.

```javascript
// Worker: Verification by Magic Bytes (File Signature)
const { fileTypeFromBuffer } = require('file-type');

async function verifyFileContent(fileBuffer, expectedMime) {
  const detectedType = await fileTypeFromBuffer(fileBuffer);

  if (!detectedType || detectedType.mime !== expectedMime) {
    throw new Error(`Security Exception: File signature mismatch. Expected ${expectedMime}, detected ${detectedType?.mime}`);
  }
}

```

---

# 5. Secure File Downloading (Access Control)

Never serve files via public URLs. Instead, route download requests through authorization middleware that issues short-lived **Pre-Signed GET URLs**.

```javascript
// Download Router
app.get('/api/files/:fileId/download', async (req, res) => {
  const { fileId } = req.params;

  // 1. Verify User Ownership / Access Rights in Database
  const fileRecord = await db.files.findById(fileId);
  if (!fileRecord || fileRecord.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // 2. Generate Short-Lived Download Signed URL (Valid for 60 seconds)
  const command = new GetObjectCommand({
    Bucket: process.env.CLEAN_S3_BUCKET_NAME,
    Key: fileRecord.cleanFileKey,
    ResponseContentDisposition: `attachment; filename="${fileRecord.originalName}"`
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  res.json({ downloadUrl });
});

```

---

# 6. Handling Large Files ($>100\text{ MB}$): Resumable Multipart Uploads

For multi-gigabyte video or asset uploads, standard single-part uploads are prone to network drops. Use **S3 Multipart Uploads**:

1. **Initiate:** Client requests multipart initialization; S3 returns an `UploadId`.
2. **Chunking:** Client splits the file into $5\text{MB}-10\text{MB}$ chunks using the HTML5 File API (`file.slice()`).
3. **Parallel Part Pre-Signing:** Server generates pre-signed URLs for each part index (`PartNumber`).
4. **Parallel Uploads:** Client uploads parts concurrently with automatic retry logic for failed chunks.
5. **Complete:** Client calls `CompleteMultipartUpload`, supplying the list of uploaded ETags. S3 stitches the parts together atomically.

---

# 7. Summary Architecture Matrix

| Security Phase      | Threat Target                    | Prevention Strategy                                          |
| ------------------- | -------------------------------- | ------------------------------------------------------------ |
| **Authentication**  | Unauthorized File Generation     | API Gateway JWT verification before issuing pre-signed URLs  |
| **In-Transit**      | Interception / Man-in-the-Middle | Strict HTTPS / TLS 1.3 endpoints                             |
| **Storage Landing** | Overwriting & Traversal Attacks  | Random UUID key naming schema (`uuid.ext`)                   |
| **Validation**      | Spoofed MIME Extensions          | Asynchronous Magic Byte inspection & ClamAV malware scanning |
| **At-Rest Storage** | Unauthenticated Data Access      | Private bucket policies + AES-256 KMS Encryption             |
| **Delivery**        | Direct Link Leaks                | Expiration-bounded Signed GET URLs                           |
