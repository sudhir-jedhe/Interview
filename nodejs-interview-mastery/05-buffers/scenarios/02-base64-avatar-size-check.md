# Validating Base64 Image Size Without Fully Decoding

**Scenario:** Your API accepts a base64-encoded profile picture in a JSON body and needs to validate it's under 2MB before writing to disk. How do you check the size correctly without fully decoding it first?

**Approach:** Base64 encoding inflates size by roughly 4/3. You can estimate the decoded size from the base64 string length without allocating a buffer, then confirm with `Buffer.byteLength` after stripping any data-URI prefix:

```js
function getDecodedSizeEstimate(base64Str) {
  const padding = (base64Str.match(/=+$/) || [''])[0].length;
  return (base64Str.length * 3) / 4 - padding;
}

function handleAvatarUpload(body) {
  const base64Data = body.avatar.replace(/^data:image\/\w+;base64,/, '');
  const estimatedBytes = getDecodedSizeEstimate(base64Data);
  const MAX = 2 * 1024 * 1024;
  if (estimatedBytes > MAX) {
    throw new Error('Image too large');
  }
  const buf = Buffer.from(base64Data, 'base64');
  return buf; // now safe to write to disk
}
```

Estimating before the full `Buffer.from` call avoids allocating memory for oversized payloads, which matters under DoS-style abuse where attackers send huge base64 blobs.
