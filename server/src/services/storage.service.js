import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

await client.files.upload({
  file: await toFile(Buffer.from("my bytes"), "file"),
  fileName: "fileName",
});

export async function uploadFile({ buffer, fileName }) {
  const responce = await client.files.upload({
    file: await toFile(buffer),
    fileName: "fileName",
    folder:"snitch"
  });

  return responce;
}
