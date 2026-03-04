import sharp from "sharp";

export const compressToUnder1MB = async (
  data: Uint8Array
): Promise<Uint8Array> => {
  const maxSize = 1024 * 1024;
  let quality = 90;

  let compressed = await sharp(data).jpeg({ quality }).toBuffer();

  while (compressed.length > maxSize && quality > 10) {
    quality -= 5;
    compressed = await sharp(data).jpeg({ quality }).toBuffer();
  }

  return new Uint8Array(compressed);
};