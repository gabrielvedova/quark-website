import {
  FileKeyAlreadyInUseError,
  ImageAccessError,
  UploadError,
} from "./errors";
import { AWSError } from "aws-sdk";
import s3 from "./s3";

export async function getImage(data: { key: string; public: boolean }) {
  const params = {
    Bucket: process.env.IMAGES_BUCKET_NAME || "",
    Key: `${data.public ? "public" : "private"}/images/${data.key}`,
    Expires: 24 * 60 * 60,
  };

  try {
    return await s3.getSignedUrlPromise("getObject", params);
  } catch (error) {
    throw new ImageAccessError();
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
    const uploadResult = await s3
      .upload({
        Bucket: process.env.IMAGES_BUCKET_NAME || "",
        Key: `${data.public ? "public" : "private"}/images/${data.key}`,
        Body: data.file.data,
        ContentType: data.file.type,
      })
      .promise();

    return uploadResult.Key;
  } catch (error) {
    throw new UploadError();
  }
}
