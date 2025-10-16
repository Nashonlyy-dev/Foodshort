// src/services/imagekit.service.js
const fs = require("fs");
const ImageKit = require("@imagekit/nodejs");
require("dotenv").config(); // make sure env is loaded

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error(
    "Missing ImageKit private key or URL endpoint in environment variables!"
  );
}

const client = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY, // optional, depending on what you use
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileOrPath, fileName) {
  // If a path is provided, stream the file to ImageKit to avoid loading whole file into memory.
  let filePayload = fileOrPath;
  const fs = require("fs");
  if (typeof fileOrPath === "string") {
    // create a read stream
    filePayload = fs.createReadStream(fileOrPath);
  }

  const response = await client.files.upload({
    file: filePayload,
    fileName: fileName,
    useUniqueFileName: true,
  });
  return response;
}

module.exports = { uploadFile };
