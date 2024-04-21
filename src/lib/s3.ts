import AWS from "aws-sdk";
import * as dotenv from "dotenv";
// import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env" });

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
  //   region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({
  endpoint: "https://s3.tebi.io",
  params: {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
  },
  region: "global",
});
export async function uploadToS3(
  file: File,
  progressCallback: (progress: number) => void
) {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: `uploads/${Date.now().toString()}${file.name.replace(" ", "-")}`,
      Body: file,
    };
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (progress) => {
        const percentage = Math.floor((progress.loaded * 100) / progress.total);
        console.log("Uploading to S3:", percentage);

        // Call the progress callback function with the percentage progress
        progressCallback(percentage);
      })
      .promise();
    await upload.then(() => console.log("successfully uploaded", params.Key));

    return Promise.resolve({
      file_key: params.Key,
      file_name: file.name,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFromS3(file_key: string) {
  try {
    const input = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: file_key,
    };
    const command = s3.deleteObject(input).promise();
    await command.then(() => console.log("successfully deleted", file_key));
    return Promise.resolve({
      file_key,
    });
  } catch (error) {
    console.log(error);
  }
}

export function getS3Url(file_key: string) {
  // https://s3.tebi.io/s3-uploads/bb92ba66-0afb-4397-abaf-b3ecdcaf70c6.jpeg
  return `https://s3.tebi.io/${process.env.NEXT_PUBLIC_BUCKET_NAME}/${file_key}`;
}
