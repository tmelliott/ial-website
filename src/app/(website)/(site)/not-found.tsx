import Link from "next/link";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="">
      {/* header */}
      <header className="pt-24 px-8 pb-12 lg:pb-32 bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-gray-400 pb-2 text-3xl">Page Not Found</div>
          <h1 className="text-6xl leading-tight lg:pb-12 text-white">
            404
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mt-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </header>

      <div className="pt-8 px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-8 items-start">
            <p className="text-lg text-gray-700">
              You can return to the homepage or browse our projects, news, and apps.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/">
                <Button type="primary">Go to Homepage</Button>
              </Link>
              <Link href="/projects">
                <Button type="secondary">View Projects</Button>
              </Link>
              <Link href="/news">
                <Button type="secondary">View News</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
