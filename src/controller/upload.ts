import S3 from "@messant/s3-client";

import { Readable } from "stream"
import { v4 as uuid } from 'uuid'
import configuration from "../config/config";

const client = new S3(configuration.S3_ENDPOINT, configuration.S3_ACCESS_KEY, configuration.S3_SECRET_KEY)

export const transferToColdStorage = async (buffer: Buffer): Promise<string> => {
    const filename = uuid()
    const readableStream = await bufferToStream(buffer)
    const s3Response = await client.putObject(configuration.S3_UPLOAD_BUCKET, filename, readableStream)
    return `${configuration.S3_UPLOAD_BUCKET}/${filename}`
}

export const removeFromColdStorage = async (photoId: string) => {
    const bucket = photoId.split("/")[0]
    const object = photoId.split("/")[1]
    await client.removeObject(bucket, object)
}

async function bufferToStream(buffer: Buffer) {
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signifies the end of the stream
    return readableStream;
}