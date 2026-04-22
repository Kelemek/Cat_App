import sharp from "sharp";

const WEBP_QUALITY = 82;

const PIXEL_LIMIT = 268_402_689;

/**
 * Encode diary uploads as WebP (same dimensions as the source after EXIF rotation).
 * GIFs: tries animated WebP first, then falls back to the first frame if that fails.
 */
export async function processDiaryImageForStorage(
  input: Buffer,
  sourceMime: string,
): Promise<Buffer> {
  const run = (animated: boolean) => {
    const opts: sharp.SharpOptions = {
      limitInputPixels: PIXEL_LIMIT,
      ...(animated ? { animated: true } : {}),
    };
    return sharp(input, opts)
      .rotate()
      .webp({
        quality: WEBP_QUALITY,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();
  };

  try {
    if (sourceMime === "image/gif") {
      try {
        return await run(true);
      } catch {
        return await run(false);
      }
    }
    return await run(false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    throw new Error(`Could not process image: ${msg}`);
  }
}
