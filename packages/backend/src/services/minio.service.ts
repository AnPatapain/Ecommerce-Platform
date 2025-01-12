import { Client } from 'minio';
import crypto from "node:crypto";
import { Express } from 'express';
import {BufferedFile} from "@app/shared-models/src/api.type";
import {CONFIG} from "../backend-config";

export class MinioClient {
    private static instance: MinioClient | null = null;
    private minioClient: Client;
    private readonly bucketName = 'shop-bucket';

    private constructor() {
        this.minioClient = new Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: true,
            accessKey: 'miniouser',
            secretKey: 'miniopassword',
        });

        // Ensure the bucket exists on initialization
        this.initializeBucket().catch(console.error);
    }

    public static getInstance(): MinioClient {
        if (!MinioClient.instance) {
            MinioClient.instance = new MinioClient();
        }
        return MinioClient.instance;
    }

    private async initializeBucket(): Promise<void> {
        const bucketExists = await this.minioClient.bucketExists(this.bucketName);
        if (!bucketExists) {
            await this.minioClient.makeBucket(this.bucketName);
        }
    }

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
            url: `${CONFIG.MINIO_ENDPOINT}:${CONFIG.MINIO_PORT}/${this.bucketName}/${fileName}`,
        }
    }

    public async delete(fileName: string) {
        return this.minioClient.removeObject(this.bucketName, fileName);
    }
}

