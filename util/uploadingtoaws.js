const aws=require('aws-sdk');

require('dotenv').config();

const BUCKET_NAME=process.env.BUCKET_NAME;
const IAM_USER_KEY=process.env.IAM_USER_KEY;
const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

let s3bucket=new aws.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET,
})

//const metadata = { "my-key": "my-value" };


exports.uploadtoS3 = (data, filename) => {
    const base64Image = data.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: imageBuffer,//data,
            ACL:'public-read',
            ContentType: 'image/png',
        };
        s3bucket.upload(params, (err, result) => {
            if (err) {
                // console.log("Something went Wrong!");
                reject(err);
            } else {
                console.log("Success!", result, result.Location);
                resolve(result.Location);
            }
        });
    });
};

