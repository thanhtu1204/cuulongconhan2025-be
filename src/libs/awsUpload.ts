import { S3 } from 'aws-sdk';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import type { AWSError } from 'aws-sdk/lib/error';
import { promises as fs } from 'fs';

import { Env } from '@/libs/Env.mjs';

/**
 * Connects to an S3 object storage instance using credentials and returns an S3 connection
 *
 * @constructor
 * @returns - S3 connection instance
 */
function Connect(): S3 {
  return new S3({
    apiVersion: 'latest',
    endpoint: Env.S3_ENDPOINT_URL,
    credentials: {
      accessKeyId: Env.S3_ACCESS_KEY,
      secretAccessKey: Env.S3_SECRET_KEY
    }
  });
}

/**
 * Uploads a file to your bucket in either the root or a subdirectory using S3
 *
 * @param filePath - The path to the file you wish to upload
 * @param bucketName - The name of your bucket (This will be the name you used when setting up with your storage provider)
 * @param objectName - The name that you want to use to store the file (must include file extension)
 * @param options - Any additional options you want to pass to the S3 client
 * @constructor
 * @returns - The full url of the uploaded file
 */
export const uploadImageToS3 = async (
  filePath: string,
  bucketName: string,
  objectName: string,
  options: any
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const s3: S3 = Connect();

    fs.readFile(filePath)
      .then((fileContent) => {
        const params: PutObjectRequest = {
          Bucket: bucketName,
          Key: objectName,
          Body: fileContent,
          ACL: 'public-read',
          ContentType: options?.contentType || 'image/png'
        };

        s3.putObject(params, (err: AWSError) => {
          if (err) reject(err);
          resolve(`https://${Env.S3_ENDPOINT_URL}/${bucketName}/${objectName}`);
        });
      })
      .catch((readFileError) => {
        reject(readFileError);
      });
  });
};
