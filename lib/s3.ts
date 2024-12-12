import { S3 } from "@aws-sdk/client-s3";

function s3Singleton() {
  return new S3();
}

declare const globalThis: {
  s3Global: ReturnType<typeof s3Singleton>;
} & typeof global;

const s3Client = globalThis.s3Global || s3Singleton();

export default s3Client;

if (process.env.NODE_ENV !== "production") globalThis.s3Global = s3Client;
