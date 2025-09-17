import NextImage from "next/image";
import { Image as PayloadImage } from "@payload-types";

type Props = {
  image: PayloadImage;
  fill?: boolean;
};

export default function Image(props: Props) {
  const { alt, url, width, height } = props.image;

  if (typeof url !== "string") return;
  return (
    <NextImage
      src={url}
      alt={alt ?? "No alt information."}
      width={props.fill ? undefined : (width ?? undefined)}
      height={props.fill ? undefined : (height ?? undefined)}
      fill={props.fill}
    />
  );
}
