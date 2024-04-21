import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(file_key: string) {
  try {
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
    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: file_key,
      //   Body: file,
    };
    const obj = await s3.getObject(params).promise();
    const file_name = `/tmp/pdf-${Date.now()}.pdf`;
    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (error) {
    console.log(error);
    return null;
  }
}
