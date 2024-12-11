import {
  FileDeletionError,
  FileKeyAlreadyInUseError,
  FileMovingError,
  FileNotFoundError,
  FileUploadError,
} from "./errors";
import { AWSError } from "aws-sdk";
import s3 from "./s3";

export async function getImage(key: string) {
  try {
    return await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.IMAGES_BUCKET_NAME || "",
      Key: key,
      Expires: 24 * 60 * 60,
    });
  } catch (error) {
    if ((error as AWSError).code === "NoSuchKey") throw new FileNotFoundError();
    throw new Error();
  }
}

async function fileExists(key: string) {
  try {
    await s3
      .headObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: key,
      })
      .promise();
    return true;
  } catch (error) {
    if ((error as AWSError).code === "NotFound") return false;
    throw Error();
  }
}

export async function uploadImage(data: {
  key: string;
  file: {
    data: Buffer;
    type: string;
  };
}) {
  const { key, file } = data;

  if (await fileExists(key)) throw new FileKeyAlreadyInUseError();

  try {
    await s3
      .upload({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: key,
        Body: file.data,
        ContentType: file.type,
      })
      .promise();
  } catch (error) {
    throw new FileUploadError();
  }
}

export async function moveImage(data: { currentKey: string; newKey: string }) {
  const { currentKey, newKey } = data;

  if (await fileExists(currentKey)) throw new FileNotFoundError();
  if (await fileExists(newKey)) throw new FileKeyAlreadyInUseError();

  try {
    await s3
      .copyObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        CopySource: currentKey,
        Key: newKey,
      })
      .promise();
  } catch (error) {
    throw new FileMovingError();
  }

  try {
    await s3
      .deleteObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: currentKey,
      })
      .promise();
  } catch (error) {
    throw new FileDeletionError();
  }
}

export async function deleteImage(key: string) {
  if (await fileExists(key)) throw new FileNotFoundError();

  try {
    await s3
      .deleteObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: key,
      })
      .promise();
  } catch (error) {
    throw new FileDeletionError();
  }
}
