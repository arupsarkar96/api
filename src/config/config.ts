import * as dotenv from 'dotenv';
dotenv.config();

if (
    !process.env.PORT ||
    !process.env.MYSQL ||
    !process.env.JWT_SECRET ||
    !process.env.DATACENTER ||
    !process.env.MACHINE_ID ||
    !process.env.S3_ENDPOINT ||
    !process.env.S3_ACCESS_KEY ||
    !process.env.S3_SECRET_KEY ||
    !process.env.S3_UPLOAD_BUCKET
) {
    throw new Error('Missing required environment variables');
}

export interface ServerConfiguration {
    PORT: number;
    MYSQL: string;
    JWT_SECRET: string;
    DATACENTER: number;
    MACHINE_ID: number;
    S3_ENDPOINT: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_UPLOAD_BUCKET: string;
}

const configuration: ServerConfiguration = {
    PORT: Number(process.env.PORT),
    MYSQL: process.env.MYSQL,
    JWT_SECRET: process.env.JWT_SECRET,
    DATACENTER: Number(process.env.DATACENTER),
    MACHINE_ID: Number(process.env.MACHINE_ID),
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET
};

export default configuration;
