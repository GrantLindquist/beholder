import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { generateUUID } from '@/utils/uuid';

const s3Client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
  },
});

export const uploadToS3 = async (content: any) => {
  const uploadParams = {
    Bucket: 'beholder-storage',
    Key: generateUUID(),
    Body: content,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(data);
    return data;
  } catch (err) {
    console.error(
      'An error occurred while attempting to put data in S3: ',
      err
    );
  }
};

export const fetchFromS3 = async (fileName: string) => {};
