import type { Image as PImage } from "@payload-types";
import Image from "next/image";

export default function PayloadImage({
  img,
  className,
}: {
  img: PImage;
  className: string;
}) {
  const url = img.url;
  const width = img.width;
  const height = img.height;

  if (!url || !width || !height) return <></>;

  console.log("URL: ", url);

  return (
    <Image
      src={img.url ?? ""}
      alt={img.alt ?? ""}
      className={className}
      width={width}
      height={height}
    />
  );
}
