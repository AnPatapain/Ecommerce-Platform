/**
 * Main configuration for backend, read from .env
 * author: Ke An Nguyen
 */
import { config } from "dotenv";
import path, { resolve } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

config({path: resolve(__dirname, "../.env")});

type EnvironmentConfig = {
    NODE_ENV?: 'development' | 'production' | 'test',
    DATABASE_URL?: string,
    HMAC_SECRET?: string,
    PUBLIC_URL?: string,
    SMTP_HOST?: string,
    SMTP_PORT?: string,
    SMTP_USER?: string,
    SMTP_PASSWORD?: string,
    MINIO_ENDPOINT?: string,
    MINIO_PORT?: string,
    MINIO_ACCESS_KEY?: string,
    MINIO_SECRET_KEY?: string,
    MINIO_BUCKET_NAME?: string,
};

const env: EnvironmentConfig = process.env as any;

export const CONFIG: typeof env= {
    // Default value, these variables can be overwritten by ...env
    NODE_ENV: 'development',
    HMAC_SECRET: 'devsecret',
    PUBLIC_URL: 'https://localhost',
    SMTP_HOST: 'smtp.ethereal.email',
    SMTP_PORT: '587',
    SMTP_USER: 'raphaelle.stamm95@ethereal.email',
    SMTP_PASSWORD: 'ujDd9JezSyrnNvxCZA',
    MINIO_ENDPOINT: 'localhost',
    MINIO_PORT: '9000',
    MINIO_ACCESS_KEY: 'miniouser',
    MINIO_SECRET_KEY: 'miniopassword',
    MINIO_BUCKET_NAME: 'shop-bucket',
    ...env,
}