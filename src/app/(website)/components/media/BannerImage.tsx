import { type Image as PayloadImage } from "@payload-types";
import Image from "next/image";

export default function BannerImage({
  image,
  size,
  fallback,
}: {
  image: number | PayloadImage | null | undefined;
  size?: keyof NonNullable<PayloadImage["sizes"]>;
  fallback?: string;
}) {
  console.log(image, fallback, size);
  if (!image || image === null || typeof image === "number") return <></>;

  const imgsrc =
    (size && image.sizes && image.sizes[size]?.url) ?? image.url ?? fallback;

  if (!imgsrc) return <></>;

  return (
    <>
      <Image
        src={imgsrc}
        fill
        alt={image.alt ?? ""}
        className="h-full w-full shadow object-cover"
      />
    </>
  );
}
