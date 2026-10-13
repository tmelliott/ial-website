import type { APIRoute } from "astro";
import { buildContactMail } from "../../lib/contactMail";
import { findCollection } from "../../lib/payload";

type MailTransport = {
  sendMail: (mail: {
    from?: string;
    replyTo?: string;
    to: string;
    cc?: string;
    subject: string;
    text: string;
    html: string;
  }) => Promise<unknown>;
};

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

export async function sendContact(
  form: FormData,
  deps: {
    gmailAddress: string;
    host: string;
    port: number;
    password: string;
    lookupTeamEmail: (slug: string) => Promise<string | undefined>;
    createTransport: (options: {
      host: string;
      port: number;
      secure: boolean;
      auth: { user: string; pass: string };
    }) => MailTransport;
  },
): Promise<Response> {
  const result = await buildContactMail(
    {
      name: field(form, "name"),
      email: field(form, "email"),
      phoneNumber: field(form, "phoneNumber"),
      message: field(form, "message"),
      person: field(form, "person"),
    },
    deps,
  );
  if (result.status === 400) return new Response(result.body, { status: 400 });

  const transport = deps.createTransport({
    host: deps.host,
    port: deps.port,
    secure: false,
    auth: { user: deps.gmailAddress, pass: deps.password },
  });
  await transport.sendMail(result.mail);
  return new Response(null, {
    status: 303,
    headers: { Location: result.location },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const { createTransport } = await import("nodemailer");
  const form = await request.formData();
  return sendContact(form, {
    gmailAddress: process.env.GMAIL_EMAIL_ADDRESS ?? "",
    host: process.env.GMAIL_EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.GMAIL_EMAIL_PORT) || 587,
    password: process.env.GMAIL_EMAIL_PASSWORD ?? "",
    lookupTeamEmail: async (slug) => {
      try {
        const [member] = await findCollection<{ email?: string | null }>("team", {
          limit: "1",
          "where[slug][equals]": slug,
        });
        return member?.email || undefined;
      } catch {
        return undefined;
      }
    },
    createTransport,
  });
};
