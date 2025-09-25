import { type Image as PayloadImage } from "@payload-types";
import Image from "next/image";
import getPlaceholder from "../../utils/getPlaceholder";

export default async function BannerImage({
  image,
  variant,
  fallback,
}: {
  image: number | PayloadImage | null | undefined;
  variant?: keyof NonNullable<PayloadImage["sizes"]>;
  fallback?: string;
}) {
  // console.log(image, fallback, size);
  if (!image || image === null || typeof image === "number") return <></>;

  const imgsrc =
    (variant && image.sizes && image.sizes[variant]?.url) ??
    image.url ??
    fallback;

  if (!imgsrc) return <></>;

  const bannerURL = imgsrc ?? "/news-placeholder.jpg";
  const bannerPH = await getPlaceholder(bannerURL);

  return (
    <div className="h-full w-full relative">
      <Image
        src={bannerURL}
        fill
        alt={image.alt ?? ""}
        sizes="560px"
        className="h-full w-full object-cover"
        placeholder="blur"
        blurDataURL={bannerPH}
      />
    </div>
  );
}
