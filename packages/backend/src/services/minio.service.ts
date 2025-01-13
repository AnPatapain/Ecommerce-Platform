import { Client } from 'minio';
import crypto from "node:crypto";
import {BufferedFile} from "@app/shared-models/src/api.type";
import {CONFIG} from "../backend-config";

export class MinioClient {
    private static instance: MinioClient | null = null;
    private minioClient: Client;
    private readonly bucketName = CONFIG.MINIO_BUCKET_NAME as string;

    private constructor() {
        this.minioClient = new Client({
            endPoint: CONFIG.MINIO_ENDPOINT as string,
            port: parseInt(CONFIG.MINIO_PORT as string),
            useSSL: false,
            accessKey: CONFIG.MINIO_ACCESS_KEY,
            secretKey: CONFIG.MINIO_SECRET_KEY,
        });
    }

    public static getInstance(): MinioClient {
        if (!MinioClient.instance) {
            MinioClient.instance = new MinioClient();
        }
        return MinioClient.instance;
    }

    /**
     * Initialize the bucket if it does not exist
     * And set the bucket policy to public
     */
    public async initializeBucket(): Promise<void> {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName);
                const policy = {
                    Version: '2012-10-17', // Correct version
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: ['*'],
                            },
                            Action: [
                                's3:GetObject',
                            ],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            }
        } catch(error: any) {
            console.error(error);
        }
    }

    /**
     * Upload a image to the bucket
     * @param file
     */
    public async upload(
        file: BufferedFile,
    ){
        const extension = file.originalname.substring(
            file.originalname.lastIndexOf('.'),
            file.originalname.length,
        );
        const timestamp = Date.now().toString();
        const hashedFileName = crypto
            .createHash('md5')
            .update(timestamp)
            .digest('hex');

        const metaData = {
            'Content-Type': file.mimetype,
        };
        const fileName = hashedFileName + extension;
        await this.minioClient.putObject(this.bucketName, fileName, file.buffer,file.size,metaData);
        return {
            url: `${CONFIG.PUBLIC_URL}/minio/${this.bucketName}/${fileName}`,
        }
    }

    /**
     * Delete a image from the bucket
     * @param fileUrl
     */
    public async delete(fileUrl: string) {
        const url = new URL(fileUrl);
        const pathSegments = url.pathname.split('/');
        const fileName = pathSegments[pathSegments.length - 1]; // Extract the last segment (filename)

        if (pathSegments[pathSegments.length - 2] === this.bucketName) {
            await this.minioClient.removeObject(this.bucketName, fileName);
            return this.minioClient.removeObject(this.bucketName, fileName);
        }
    }
}

