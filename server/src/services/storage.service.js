import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

const response = await client.files.upload({
  file: fs.createReadStream("path/to/file"),
  fileName: "file-name.jpg",
});

console.log(response);
