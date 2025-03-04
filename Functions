const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log("Lambda invoked. Event received:", JSON.stringify(event));

  // The CSV content passed in from the frontend. 
  // This assumes your frontend sends raw CSV in event.body.
  const csvContent = event.body;

  // Extract the filename (SID) from headers or use a timestamp as fallback
  const filenameFromHeader = event.headers && event.headers['x-filename'];
  const filename = filenameFromHeader ? filenameFromHeader : new Date().toISOString();

  // Configure AWS with credentials and endpoint information from environment variables
  AWS.config.update({
    accessKeyId: process.env.key_id,
    secretAccessKey: process.env.secret_key,
    region: process.env.region,
    s3ForcePathStyle: true,
    endpoint: process.env.endpoint,  // e.g., "https://s3.amazonaws.com" if standard S3
  });

  // Create an S3 instance
  const s3 = new AWS.S3();
  
  // Make sure AWS_BUCKET_NAME is set as an environment variable for the Lambda
  const bucketName = process.env.AWS_BUCKET_NAME;

  // Construct the S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: csvContent, // CSV data
  };

  try {
    // Perform the file upload
    const response = await s3.upload(params).promise();
    console.log("File uploaded successfully:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File uploaded successfully" }),
    };
  } catch (error) {
    console.error("An error occurred during file upload:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred during file upload" }),
    };
  }
};
