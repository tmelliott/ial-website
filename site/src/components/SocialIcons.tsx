import { SocialIcon } from "react-social-icons";

export default function SocialIcons({
  links,
}: {
  links: { id?: string | null; url: string }[];
}) {
  return (
    <div className="flex gap-4 justify-center lg:justify-start">
      {links.map((link) => (
        <SocialIcon
          url={link.url}
          key={link.id ?? link.url}
          style={{ height: "2em", width: "2em" }}
        />
      ))}
    </div>
  );
}
