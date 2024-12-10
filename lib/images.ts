import {
  FileDeleteError,
  FileKeyAlreadyInUseError,
  FileMoveError,
  FileNotFoundError,
  ImageNotFoundError,
  UploadError,
} from "./errors";
import { AWSError } from "aws-sdk";
import s3 from "./s3";

export async function getImage(data: { key: string; public: boolean }) {
  try {
    return await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.IMAGES_BUCKET_NAME || "",
      Key: `${data.public ? "public" : "private"}/images/${data.key}`,
      Expires: 24 * 60 * 60,
    });
  } catch (error) {
    if ((error as AWSError).code === "NoSuchKey")
      throw new ImageNotFoundError();
    throw new Error();
  }
}

async function fileExists(key: string, isPublic: boolean) {
  try {
    await s3
      .headObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: `${isPublic ? "public" : "private"}/images/${key}`,
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
  public: boolean;
  file: {
    data: Buffer;
    type: string;
  };
}) {
  if (await fileExists(data.key, data.public))
    throw new FileKeyAlreadyInUseError();

  try {
    await s3
      .upload({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: `${data.public ? "public" : "private"}/images/${data.key}`,
        Body: data.file.data,
        ContentType: data.file.type,
      })
      .promise();
  } catch (error) {
    throw new UploadError();
  }
}

export async function moveImage(data: {
  currentKey: string;
  currentlyPublic: boolean;
  newKey: string;
  newPublic: boolean;
}) {
  if (await fileExists(data.currentKey, data.currentlyPublic))
    throw new FileNotFoundError();

  if (await fileExists(data.newKey, data.newPublic))
    throw new FileKeyAlreadyInUseError();

  try {
    await s3
      .copyObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        CopySource: `${process.env.IMAGES_BUCKET_NAME || ""}/${
          data.currentlyPublic ? "public" : "private"
        }/images/${data.currentKey}`,
        Key: `${data.newPublic ? "public" : "private"}/images/${data.newKey}`,
      })
      .promise();
  } catch (error) {
    throw new FileMoveError();
  }

  try {
    await s3
      .deleteObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: `${data.currentlyPublic ? "public" : "private"}/images/${
          data.currentKey
        }`,
      })
      .promise();
  } catch (error) {
    throw new FileDeleteError();
  }
}

export async function deleteImage(data: { key: string; public: boolean }) {
  if (await fileExists(data.key, data.public)) throw new FileNotFoundError();

  try {
    await s3
      .deleteObject({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: `${data.public ? "public" : "private"}/images/${data.key}`,
      })
      .promise();
  } catch (error) {
    throw new FileDeleteError();
  }
}
