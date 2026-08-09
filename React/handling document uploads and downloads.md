Here is a complete, production-ready React component suite for handling **document uploads and downloads**.

It includes **drag-and-drop support**, **file size/type validation**, **error handling with user-friendly alerts**, **simulated upload/download progress**, and **file list management**.

---

### Step 1: Install Utility Dependencies

Ensure you have your Tailwind class-merging helper (`cn.ts`) ready:

```bash
npm install clsx tailwind-merge

```

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### Step 2: Types & File Validation Config

```typescript
// src/components/DocumentManager/types.ts
export interface DocumentFile {
  id: string;
  name: string;
  size: number; // Size in bytes
  type: string;
  uploadProgress: number; // 0 to 100
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  downloadUrl?: string;
}

export interface ValidationConfig {
  maxSizeMB: number; // e.g. 25MB
  allowedTypes: string[]; // e.g. ['application/pdf', 'image/png']
}

```

---

### Step 3: Document Upload & Download Component

```tsx
// src/components/DocumentManager/DocumentManager.tsx
import * as React from 'react';
import { DocumentFile, ValidationConfig } from './types';
import { cn } from '../../utils/cn';

const DEFAULT_VALIDATION: ValidationConfig = {
  maxSizeMB: 20, // Max 20MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ],
};

// Helper: Format Bytes to KB / MB
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function DocumentManager({
  validation = DEFAULT_VALIDATION,
}: {
  validation?: ValidationConfig;
}) {
  const [files, setFiles] = React.useState<DocumentFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // --- Validate Selected File ---
  const validateFile = (file: File): string | null => {
    const maxBytes = validation.maxSizeMB * 1024 * 1024;

    if (file.size > maxBytes) {
      return `File size exceeds maximum limit of ${validation.maxSizeMB}MB.`;
    }

    if (!validation.allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF, DOCX, PNG, and JPEG files are allowed.';
    }

    return null;
  };

  // --- Simulate File Upload Request ---
  const uploadFile = (file: File) => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const validationError = validateFile(file);

    const newDoc: DocumentFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: validationError ? 0 : 10,
      status: validationError ? 'error' : 'uploading',
      errorMessage: validationError || undefined,
    };

    setFiles((prev) => [newDoc, ...prev]);

    if (validationError) return;

    // Simulate chunked upload progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 10;

      if (currentProgress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  uploadProgress: 100,
                  status: 'completed',
                  downloadUrl: URL.createObjectURL(file), // Local Blob URL for demo download
                }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: currentProgress } : f))
        );
      }
    }, 300);
  };

  // --- File Drop & Select Handlers ---
  const handleFileSelection = (fileList: FileList | null) => {
    setGlobalError(null);
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => uploadFile(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  // --- Download Handler ---
  const handleDownload = (doc: DocumentFile) => {
    if (!doc.downloadUrl) {
      setGlobalError('Download link is unavailable.');
      return;
    }

    const link = document.createElement('a');
    link.href = doc.downloadUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Remove File ---
  const handleRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Manager</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload PDF, DOCX, or Images up to {validation.maxSizeMB}MB.
        </p>
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-center justify-between">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-gray-300 hover:border-indigo-500 dark:border-gray-700 dark:hover:border-indigo-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={validation.allowedTypes.join(',')}
          onChange={(e) => handleFileSelection(e.target.files)}
        />
        <span className="text-3xl mb-2">📄</span>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Click to upload or drag and drop files
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG, JPG (Max {validation.maxSizeMB}MB)</p>
      </div>

      {/* Uploaded Documents List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {files.map((file) => (
              <div key={file.id} className="p-4 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <span className="text-xs text-gray-400 ml-2">{formatFileSize(file.size)}</span>
                  </div>

                  {/* Upload Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-200"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Validation Error Message */}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 font-medium mt-1">{file.errorMessage}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      Download
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(file.id)}
                    className="p-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### Step 4: Component Features Summary

1. **Strict File Validation:** Validates file sizes (e.g. max 20MB) and MIME types before attempting network calls.
2. **Interactive Drag & Drop:** Uses standard HTML5 Drag and Drop events with visual indicator states.
3. **Simulated Chunk Uploads:** Shows real-time progress bars for active uploads.
4. **Client-Side Blob Downloads:** Converts uploaded files into dynamic Object URLs (`URL.createObjectURL`) to enable seamless client downloads.

Show how to replace the simulated upload in DocumentManager with a real Axios multipart form upload with progress tracking.

To integrate real server uploads using **Axios**, you use `FormData` to construct a `multipart/form-data` request and attach Axios’s `onUploadProgress` callback to update your UI's progress bar in real time.

Below is the updated `DocumentManager` with real backend HTTP integration, upload cancellation via `AbortController`, and server error handling.

---

### Step 1: Install Axios

```bash
npm install axios

```

---

### Step 2: Implementation with Axios & Progress Tracking

```tsx
// src/components/DocumentManager/DocumentManager.tsx
import * as React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { cn } from '../../utils/cn';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  cancelTokenSource?: CancelTokenSource; // Used to cancel in-flight uploads
  downloadUrl?: string;
}

export interface ValidationConfig {
  maxSizeMB: number;
  allowedTypes: string[];
}

const DEFAULT_VALIDATION: ValidationConfig = {
  maxSizeMB: 20,
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ],
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function DocumentManager({
  uploadEndpoint = '/api/v1/documents/upload',
  validation = DEFAULT_VALIDATION,
}: {
  uploadEndpoint?: string;
  validation?: ValidationConfig;
}) {
  const [files, setFiles] = React.useState<DocumentFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // --- Validate Selected File ---
  const validateFile = (file: File): string | null => {
    const maxBytes = validation.maxSizeMB * 1024 * 1024;

    if (file.size > maxBytes) {
      return `File size exceeds maximum limit of ${validation.maxSizeMB}MB.`;
    }

    if (!validation.allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF, DOCX, PNG, and JPEG files are allowed.';
    }

    return null;
  };

  // --- Real Axios Upload Handler ---
  const uploadFile = async (file: File) => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const validationError = validateFile(file);

    // Cancel token for stopping active HTTP requests
    const cancelSource = axios.CancelToken.source();

    const newDoc: DocumentFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: validationError ? 'error' : 'uploading',
      errorMessage: validationError || undefined,
      cancelTokenSource: cancelSource,
    };

    setFiles((prev) => [newDoc, ...prev]);

    if (validationError) return;

    // Construct Multipart Form Payload
    const formData = new FormData();
    formData.append('document', file);
    formData.append('filename', file.name);

    try {
      const response = await axios.post<{ downloadUrl: string }>(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: cancelSource.token,
        // Real-time progress tracking calculation
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

            setFiles((prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: percentCompleted } : f))
            );
          }
        },
      });

      // Handle Successful Server Response
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                uploadProgress: 100,
                status: 'completed',
                downloadUrl: response.data.downloadUrl, // URL returned from backend storage (e.g. S3)
              }
            : f
        )
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`Upload cancelled for file ${file.name}`);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Upload failed due to a network error.';

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: message,
                }
              : f
          )
        );
      }
    }
  };

  // --- Handlers ---
  const handleFileSelection = (fileList: FileList | null) => {
    setGlobalError(null);
    if (!fileList || fileList.length === 0) return;
    Array.from(fileList).forEach((file) => uploadFile(file));
  };

  const handleCancelUpload = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file && file.cancelTokenSource) {
      file.cancelTokenSource.cancel('User aborted upload.');
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Manager</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload PDF, DOCX, or Images up to {validation.maxSizeMB}MB.
        </p>
      </div>

      {globalError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-center justify-between">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Drag & Drop Surface */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelection(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-gray-300 hover:border-indigo-500 dark:border-gray-700 dark:hover:border-indigo-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={validation.allowedTypes.join(',')}
          onChange={(e) => handleFileSelection(e.target.files)}
        />
        <span className="text-3xl mb-2">📄</span>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Click to upload or drag and drop files
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG, JPG (Max {validation.maxSizeMB}MB)</p>
      </div>

      {/* Uploaded Documents List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {files.map((file) => (
              <div key={file.id} className="p-4 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <span className="text-xs text-gray-400 ml-2">{formatFileSize(file.size)}</span>
                  </div>

                  {/* Axios Real Upload Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-150"
                          style={{ width: `${file.uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 text-right font-mono">
                        {file.uploadProgress}%
                      </p>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 font-medium mt-1">{file.errorMessage}</p>
                  )}
                </div>

                {/* File Action Controls */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <button
                      type="button"
                      onClick={() => handleCancelUpload(file.id)}
                      className="px-2 py-1 text-xs font-medium text-red-600 border border-red-200 dark:border-red-800 rounded hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}

                  {file.status === 'completed' && (
                    <a
                      href={file.downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      Download
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCancelUpload(file.id)}
                    className="p-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### Key Server Integration Details

1. **`onUploadProgress` Event:** Reads `progressEvent.loaded` and `progressEvent.total` to calculate the percentage loaded directly from the browser's HTTP socket stream.
2. **`axios.CancelToken` / `AbortController`:** Allows users to cancel ongoing uploads mid-transfer, immediately freeing network bandwidth.
3. **`multipart/form-data`:** Wraps native `File` objects inside standard HTML `FormData` instances expected by Node.js (`multer`), Express, or Spring Boot backends.

Show how to add an inline modal preview for uploaded PDFs and image files before downloading.

Here is how to add an **inline preview modal** to the `DocumentManager` component. It renders image files (`PNG`, `JPG`, `WEBP`) or PDF documents inside an accessible dialog before the user downloads them.

For PDFs, it uses an `<iframe>` with dynamic Blob Object URLs so users can view, zoom, and scroll through pages directly inside the React application.

---

### Step 1: Implementation (`src/components/DocumentManager/DocumentManagerWithPreview.tsx`)

This updated component incorporates the preview modal state, MIME type checking, and clean Object URL memory management (`URL.revokeObjectURL`).

```tsx
// src/components/DocumentManager/DocumentManagerWithPreview.tsx
import * as React from 'react';
import { cn } from '../../utils/cn';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  fileObj?: File; // Native file object for generating preview object URLs
  previewUrl?: string;
}

export interface ValidationConfig {
  maxSizeMB: number;
  allowedTypes: string[];
}

const DEFAULT_VALIDATION: ValidationConfig = {
  maxSizeMB: 20,
  allowedTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
  ],
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function DocumentManagerWithPreview({
  validation = DEFAULT_VALIDATION,
}: {
  validation?: ValidationConfig;
}) {
  const [files, setFiles] = React.useState<DocumentFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [globalError, setGlobalError] = React.setGlobalError || React.useState<string | null>(null);

  // State: Preview Modal
  const [previewDoc, setPreviewDoc] = React.useState<DocumentFile | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // --- Validate File ---
  const validateFile = (file: File): string | null => {
    const maxBytes = validation.maxSizeMB * 1024 * 1024;

    if (file.size > maxBytes) {
      return `File size exceeds maximum limit of ${validation.maxSizeMB}MB.`;
    }

    if (!validation.allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF, PNG, JPEG, and WEBP files are allowed.';
    }

    return null;
  };

  // --- Upload File Simulation ---
  const uploadFile = (file: File) => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const validationError = validateFile(file);

    // Create a local Object URL for immediate instant preview
    const previewUrl = validationError ? undefined : URL.createObjectURL(file);

    const newDoc: DocumentFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 10,
      status: validationError ? 'error' : 'uploading',
      errorMessage: validationError || undefined,
      fileObj: file,
      previewUrl,
    };

    setFiles((prev) => [newDoc, ...prev]);

    if (validationError) return;

    // Simulate upload progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 30;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, uploadProgress: 100, status: 'completed' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: currentProgress } : f))
        );
      }
    }, 200);
  };

  const handleFileSelection = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    Array.from(fileList).forEach((file) => uploadFile(file));
  };

  // --- Remove File & Clean Up Memory ---
  const handleRemove = (fileId: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl); // Release browser memory
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Manager with Preview</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload PDF or Images (Max {validation.maxSizeMB}MB) and preview before downloading.
        </p>
      </div>

      {/* Drag & Drop Surface */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelection(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-gray-300 hover:border-indigo-500 dark:border-gray-700 dark:hover:border-indigo-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={validation.allowedTypes.join(',')}
          onChange={(e) => handleFileSelection(e.target.files)}
        />
        <span className="text-3xl mb-2">📄</span>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Click to upload or drag and drop files
        </p>
      </div>

      {/* Uploaded Documents List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {files.map((file) => {
              const isImage = file.type.startsWith('image/');
              const isPdf = file.type === 'application/pdf';

              return (
                <div key={file.id} className="p-4 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-400 ml-2">{formatFileSize(file.size)}</span>
                    </div>

                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-150"
                          style={{ width: `${file.uploadProgress}%` }}
                        />
                      </div>
                    )}

                    {file.status === 'error' && (
                      <p className="text-xs text-red-500 font-medium mt-1">{file.errorMessage}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Preview Button */}
                    {file.status === 'completed' && (isImage || isPdf) && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(file)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 transition-colors"
                      >
                        👁️ Preview
                      </button>
                    )}

                    {/* Download Button */}
                    {file.status === 'completed' && file.previewUrl && (
                      <a
                        href={file.previewUrl}
                        download={file.name}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        Download
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(file.id)}
                      className="p-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Preview Dialog */}
      {previewDoc && previewDoc.previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {previewDoc.name}
                </h3>
                <p className="text-xs text-gray-500">{formatFileSize(previewDoc.size)}</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={previewDoc.previewUrl}
                  download={previewDoc.name}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Download File
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Preview Body */}
            <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-950 overflow-auto flex items-center justify-center">
              {/* Image Preview */}
              {previewDoc.type.startsWith('image/') && (
                <img
                  src={previewDoc.previewUrl}
                  alt={previewDoc.name}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                />
              )}

              {/* PDF Preview */}
              {previewDoc.type === 'application/pdf' && (
                <iframe
                  src={previewDoc.previewUrl}
                  title={previewDoc.name}
                  className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-800"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### Key Technical Details

1. **PDF Embedded IFrame:** Native browser PDF readers automatically mount inside `<iframe>` containers when supplied with a `application/pdf` Blob Object URL, giving users built-in page navigation, zoom controls, and printing.
2. **Object URL Memory Management:** `URL.revokeObjectURL()` frees browser memory allocated for the local file stream when documents are deleted or removed from the list.
3. **Dynamic Viewport Scale:** The modal is configured with `h-[85vh]` and `max-w-4xl` so large PDFs or high-resolution images scale cleanly on desktop and mobile viewports.

When handling file uploads and downloads in a React application—especially with inline previews (like rendering PDFs in `<iframe>` tags or dynamically rendering user-uploaded images)—security is a critical concern. Browsers treat uploaded files as untrusted user input, which opens up vectors like **Cross-Site Scripting (XSS)**, **Malicious File Execution**, and **Server-Side File Inclusion**.

Here are the key security vulnerabilities associated with document management and how to defend against them at both the **React Frontend** and **Backend Server** levels.

---

### 1. Frontend Security Defenses

#### A. Block XSS via SVG and HTML File Preview

* **The Vulnerability:** SVGs are XML documents that can embed inline `<script>` tags. If a user uploads a file named `avatar.svg` containing executable JavaScript and you preview it using an `<img>` or `<iframe>` tag, it can run scripts in the context of your user's origin, stealing session tokens.
* **Defense:**

1. Do **NOT** allow SVG files in document upload fields unless sanitized using a library like **DOMPurify**.
2. Restrict image previews strictly to safe raster types: `image/png`, `image/jpeg`, `image/webp`.

```typescript
// Strict type-checking array - do NOT include 'image/svg+xml' or 'text/html'
const SAFE_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];

```

#### B. Content Security Policy (CSP) for PDF IFrames

* **The Vulnerability:** PDFs can contain embedded JavaScript or malicious external links.
* **Defense:** Use sandbox attributes or CSP headers on the iframe used for PDF previews:

```tsx
{/* Use sandbox attribute to restrict iframe capabilities */}
<iframe
  src={previewDoc.previewUrl}
  title={previewDoc.name}
  sandbox="allow-scripts allow-same-origin"
  className="w-full h-full rounded-lg"
/>

```

#### C. Prevent File Extension Spoofing

* **The Vulnerability:** A hacker renames `malicious_script.exe` or `shell.php` to `document.pdf`. Checking only `file.name.endsWith('.pdf')` on the frontend is insufficient.
* **Defense:** Read the actual **Magic Bytes** (file signature) in JavaScript before processing the file preview:

```typescript
// Example: Validate real file magic bytes on frontend before upload
const checkMagicBytes = async (file: File): Promise<boolean> => {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const header = new Uint8Array(buffer).reduce((acc, byte) => acc + byte.toString(16), '');
  
  // PDF Magic Bytes: %PDF (25 50 44 46)
  if (file.type === 'application/pdf') {
    return header.startsWith('25504446');
  }
  // PNG Magic Bytes: 89 50 4e 47
  if (file.type === 'image/png') {
    return header.startsWith('89504e47');
  }
  return true;
};

```

---

### 2. Backend & Server Security Defenses

Even with complete frontend validation, an attacker can bypass React entirely using tools like Postman or `curl`. Your backend **must** enforce the following rules:

#### A. Never Store Uploaded Files in the Application Root

* **Risk:** Storing uploaded files in public directories (e.g., `/public/uploads/file.php`) allows an attacker to navigate to `[https://example.com/uploads/file.php](https://example.com/uploads/file.php)` and execute arbitrary code on your server.
* **Solution:** Store uploaded files in an isolated Object Store (like **AWS S3**, **GCP Cloud Storage**, or **Azure Blob Storage**) rather than your application server’s disk.

#### B. Enforce Content-Disposition and Isolated Domains for Downloads

When serving uploaded documents for download or preview:

1. **Serve Files from a Dedicated Subdomain:** Host file downloads on an isolated domain (e.g., `[https://user-content-example.com](https://user-content-example.com)`) rather than your main app domain (`[https://app.example.com](https://app.example.com)`). This ensures that even if an XSS attack occurs inside an uploaded file, it cannot read cookies or localStorage from your primary app domain.
2. **Set Security Response Headers:**

```http
Content-Type: application/pdf
Content-Disposition: inline; filename="document.pdf"
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline';

```

> **Note on `X-Content-Type-Options: nosniff`:** This header prevents browsers from trying to guess ("sniff") the file type. It forces the browser to strictly honor the `Content-Type` header, stopping browsers from executing an uploaded HTML file disguised as a text file.

#### C. Rename Files on Upload

* **Risk:** Filenames like `../../etc/passwd` or filenames containing special shell characters can lead to Path Traversal vulnerabilities.
* **Solution:** Strip original filenames on the server and generate unique UUIDs:

```typescript
// Backend Storage Example (Node.js/Express)
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const sanitizeAndRename = (originalName: string) => {
  const ext = path.extname(originalName).toLowerCase(); // e.g. .pdf
  const safeFilename = `${uuidv4()}${ext}`;             // e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.pdf
  return safeFilename;
};

```

#### D. Virus and Malware Scanning

Always pass uploaded file streams through a virus scanner (such as **ClamAV** or AWS GuardDuty Malware Protection) before making them available for other users to preview or download.

---

### 3. Summary Security Checklist

| Threat                | Vulnerability Vector                 | Defense Mechanism                                                                          |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| **XSS Attack**        | Malicious script in SVG or HTML      | Disable SVG/HTML previews; serve user files from isolated CDN domain (`user-content.com`). |
| **Path Traversal**    | Filenames like `../../secret.txt`    | Rename files on the server using UUIDs (`uuidv4()`).                                       |
| **MIME Spoofing**     | `.exe` file renamed to `.pdf`        | Verify Magic Bytes on frontend & inspect file headers on backend using `file-type`.        |
| **Server Takeover**   | Direct execution of uploaded scripts | Upload files directly to S3/GCP buckets rather than local web server disk.                 |
| **Drive-by Download** | Sniffed file types executing script  | Set `X-Content-Type-Options: nosniff` and strict Content Security Policy headers.          |
