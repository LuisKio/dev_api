/* eslint-disable */
const fs = require('fs')

const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

require('dotenv').config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

//Returns a Promise
const uploadFile = (fileMulterObject, fileName) => {
  const fileStream = fs.createReadStream(fileMulterObject.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName,
    ContentType: fileMulterObject.mimetype,
  }

  return s3Client.send(new PutObjectCommand(uploadParams))
}

//Returns a Promise
const deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams))
}

function getFileStream (Key) {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ 
      Bucket: bucketName, 
      Key: Key._parsedUrl.search
    })

    try {
      const response = await s3Client.send(getObjectCommand)
      // Store all of data chunks returned from the response data stream 
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks = []
      
      // Handle an error while streaming the response body
      response.Body.once('error', err => reject(err))
  
      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on('data', chunk => responseDataChunks.push(chunk))
  
      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once('end', () => resolve(responseDataChunks.join('')))
    } catch (err) {
      // Handle the error or throw
      return reject(err)
    } 
  })
}


module.exports = {
  uploadFile,
  deleteFile,
  getFileStream
}