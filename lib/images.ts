import {
  FileDeletionError,
  FileKeyAlreadyInUseError,
  FileMovingError,
  FileNotFoundError,
  FileUploadError,
} from "./errors";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./s3";

export async function getImage(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "",
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 24 * 60 * 60, // 24 hours
    });

    return signedUrl;
  } catch (error) {
    if (error instanceof Error && error.name === "NoSuchKey") {
      throw new FileNotFoundError();
    }

    throw error;
  }
}

async function fileExists(key: string) {
  const command = new HeadObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "",
    Key: key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "NotFound") {
      return false;
    }

    throw error;
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

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "",
    Key: key,
    Body: file.data,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
  } catch {
    throw new FileUploadError();
  }
}

export async function moveImage(data: { currentKey: string; newKey: string }) {
  const { currentKey, newKey } = data;

  if (!(await fileExists(currentKey))) throw new FileNotFoundError();
  if (await fileExists(newKey)) throw new FileKeyAlreadyInUseError();

  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.IMAGES_BUCKET_NAME || "",
    CopySource: `${process.env.S3_BUCKET_NAME || ""}/${currentKey}`,
    Key: newKey,
  });

  try {
    await s3Client.send(copyCommand);
  } catch {
    throw new FileMovingError();
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.IMAGES_BUCKET_NAME || "",
    Key: currentKey,
  });

  try {
    await s3Client.send(deleteCommand);
  } catch {
    throw new FileDeletionError();
  }
}

export async function deleteImage(key: string) {
  if (!(await fileExists(key))) throw new FileNotFoundError();

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || "",
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch {
    throw new FileDeletionError();
  }
}
