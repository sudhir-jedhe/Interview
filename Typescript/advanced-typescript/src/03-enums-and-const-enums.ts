// enum -> create a real javasript object at runtime

// const enum -> does not create any runtime object

enum UploadStatus {
  draft = "draft",
  processing = "processing",
  final = "final",
}

function printUploadStatus(status: UploadStatus): void {
  console.log(status);
}

printUploadStatus(UploadStatus.draft);

// printUploadStatus("random")

console.log(UploadStatus);

// const enum
// it is removed from the final js output

const enum HttpStatusCode {
  ok = 200,
  failed = 400,
}

function sendResponse(statusCode: HttpStatusCode, message: string): void {
  console.log(statusCode, message);
}

sendResponse(HttpStatusCode.ok, "success");

// console.log(HttpStatusCode);
