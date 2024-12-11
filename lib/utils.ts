export function generateUniqueFilename(): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}`;
}
