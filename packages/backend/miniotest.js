import { Client } from 'minio';

const minioClient = new Client({
    endPoint: 'localhost',               // Replace with your MinIO service name or IP
    port: 9000,                      // Default MinIO API port
    useSSL: false,                    // Ensure SSL is properly configured
    accessKey: 'miniouser',
    secretKey: 'miniopassword',
});

// Test MinIO Connection by Listing Buckets
async function testMinioConnection() {
    try {
        console.log("Attempting to list buckets...");
        const buckets = await minioClient.listBuckets();
        console.log("Buckets:", buckets);
    } catch (error) {
        console.error("Error connecting to MinIO:", error);
    }
}

// Run the Test
testMinioConnection();
