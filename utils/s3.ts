import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { generateUUID } from '@/utils/uuid';

const s3Client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? 'AKIA3NZUVZRN4NJRAAC7',
    secretAccessKey:
      process.env.AWS_SECRET_KEY ?? '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',
  },
});

// TODO: Update CORS to work with prod URL
export const uploadToS3 = async (content: any) => {
  const uploadParams = {
    Bucket: 'beholder-storage-b7he20lv',
    Key: generateUUID(),
    Body: content,
  };

  // console.log(process.env.AWS_ACCESS_KEY);

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
