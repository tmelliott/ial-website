import fs from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageVariants } from "../../lib/imageVariants";

type UploadFile = {
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  filepath?: string;
  path?: string | null;
  tmpWorkingDirectory?: string;
  width?: number;
  height?: number;
  size?: number;
  sizeInBytes?: number;
  blurDataURL?: string | null;
  buffer?: Buffer;
  getStream?: () => NodeJS.ReadableStream;
};

type BreakpointFile = {
  key: string;
  file: UploadFile;
};

type ImageManipulation = {
  generateResponsiveFormats: (file: UploadFile) => Promise<BreakpointFile[]>;
  generateThumbnail: (file: UploadFile) => Promise<UploadFile | null>;
};

function kbytes(bytes: number): number {
  return Math.round((bytes / 1000) * 100) / 100;
}

async function readUploadBuffer(file: UploadFile): Promise<Buffer | null> {
  if (file.buffer && Buffer.isBuffer(file.buffer)) return file.buffer;
  if (file.filepath) return fs.promises.readFile(file.filepath);
  return null;
}

/**
 * Writes proportional width files and blurDataURL.
 * Leaves generateThumbnail alone so the admin thumbnail still exists.
 */
function attachImageVariants(imageManipulation: ImageManipulation) {
  imageManipulation.generateResponsiveFormats = async (file) => {
    const mime = file.mime ?? "";
    const buffer = await readUploadBuffer(file);
    if (!buffer) return [];

    const variants = await imageVariants(buffer, mime);
    if (variants.blurDataURL) file.blurDataURL = variants.blurDataURL;

    const written: BreakpointFile[] = [];
    for (const variant of variants.widths) {
      const hash = `${variant.key}_${file.hash ?? "file"}`;
      const directory = file.tmpWorkingDirectory || process.cwd();
      await mkdir(directory, { recursive: true });
      const filepath = path.join(directory, hash);
      await writeFile(filepath, variant.buffer);
      written.push({
        key: variant.key,
        file: {
          name: `${variant.key}_${file.name ?? "file"}`,
          hash,
          ext: file.ext,
          mime: file.mime,
          filepath,
          path: file.path || null,
          getStream: () => fs.createReadStream(filepath),
          width: variant.width,
          height: variant.height,
          size: kbytes(variant.buffer.length),
          sizeInBytes: variant.buffer.length,
        },
      });
    }
    return written;
  };
}

export default (plugin: {
  services: Record<string, ImageManipulation | ((...args: unknown[]) => ImageManipulation)>;
}) => {
  const service = plugin.services["image-manipulation"];
  if (typeof service === "function") {
    plugin.services["image-manipulation"] = ((...args: unknown[]) => {
      const imageManipulation = service(...args);
      attachImageVariants(imageManipulation);
      return imageManipulation;
    }) as typeof service;
  } else if (service) {
    attachImageVariants(service);
  }
  return plugin;
};
