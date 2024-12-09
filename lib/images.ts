import { ImageAccessError } from "./errors";
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
