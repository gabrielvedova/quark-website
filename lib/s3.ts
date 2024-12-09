import AWS from "aws-sdk";

function s3Singleton() {
  return new AWS.S3();
}

declare const globalThis: {
  s3Global: ReturnType<typeof s3Singleton>;
} & typeof global;

/**
 * A singleton instance of S3.
 */
const s3 = globalThis.s3Global || s3Singleton();

export default s3;

if (process.env.NODE_ENV !== "production") globalThis.s3Global = s3;
