const AWS = require('aws-sdk');

module.exports.handler = async function(event, context) {
  console.log("HTTP method received:", event.httpMethod);
  
  // Allow only POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }
  
  // CSV content from the request body.
  const csvContent = event.body;
  // Get filename from headers or use a timestamp-based fallback.
  const filenameFromHeader = event.headers['x-filename'];
  const filename = filenameFromHeader ? filenameFromHeader : `${new Date().toISOString()}.csv`;
  
  // Configure AWS SDK using environment variables.
  AWS.config.update({
    accessKeyId: process.env.key_id,
    secretAccessKey: process.env.secret_key,
    region: process.env.region,
    s3ForcePathStyle: true,
    endpoint: process.env.endpoint  // e.g., "https://s3.amazonaws.com" if using standard S3
  });
  
  const s3 = new AWS.S3();
  const bucketName = process.env.reappraisalexperiment;
  console.log("Bucket name:", bucketName);
  
  if (!bucketName) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Bucket name not defined in environment variables" })
    };
  }
  
  // S3 upload parameters.
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: csvContent
  };
  
  try {
    const s3Response = await s3.upload(params).promise();
    console.log("File uploaded successfully:", s3Response);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "File uploaded successfully", response: s3Response })
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "File upload failed", details: error.message })
    };
  }
};
