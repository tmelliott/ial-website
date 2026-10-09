import { SocialIcon } from "react-social-icons";

export default function SocialIcons({
  links,
}: {
  links: { id?: string | null; url?: string | null }[];
}) {
  return (
    <div className="flex gap-4 pt-4">
      {links.map((social) => (
        <SocialIcon
          url={social.url ?? ""}
          key={social.id ?? social.url}
          style={{
            height: 36,
            width: 36,
          }}
        />
      ))}
    </div>
  );
}
