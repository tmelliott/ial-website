import Link from "next/link";
import Button from "../../components/Button";

export default function CTA({
  text1,
  text2,
  text3,
  url,
}: {
  text1: string;
  text2: string;
  text3: string;
  url: string;
}) {
  return (
    <div className="bg-linear-150 from-bg-gradient-start from-15% to-bg-gradient-end to-[125%] md:h-96 overflow-clip -mx-8 px-8 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between md:items-center h-full gap-12">
        <p className="text-3xl">
          {text1} <span className="text-[#E83150]">{text2}</span>
        </p>
        <Link href={url}>
          <Button type="alternate" className="text-3xl">
            {text3}
          </Button>
        </Link>
      </div>
    </div>
  );
}
