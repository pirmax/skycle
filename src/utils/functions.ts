import sharp from "sharp";

export const compressToUnder1MB = async (
  data: Uint8Array | Buffer,
): Promise<Uint8Array<ArrayBuffer>> => {
  const maxSize = 1024 * 1024;
  let quality = 90;

  let compressed = await sharp(Buffer.from(data)).jpeg({ quality }).toBuffer();

  while (compressed.length > maxSize && quality > 10) {
    quality -= 5;
    compressed = await sharp(Buffer.from(data)).jpeg({ quality }).toBuffer();
  }

  const buffer = compressed.buffer.slice(
    compressed.byteOffset,
    compressed.byteOffset + compressed.byteLength,
  );

  return new Uint8Array(buffer) as Uint8Array<ArrayBuffer>;
};
