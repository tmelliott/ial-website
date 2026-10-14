import type { APIRoute } from "astro";
import { allowContactSubmission, clientIp } from "../../lib/contactLimit";
import { buildContactMail } from "../../lib/contactMail";
import { findCollection } from "../../lib/payload";
import { verifyTurnstile } from "../../lib/turnstile";

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

function redirect(path: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: path, "cache-control": "no-store" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const ip = clientIp({
    forwardedFor: request.headers.get("x-forwarded-for"),
    realIp: request.headers.get("x-real-ip"),
  });
  if (!allowContactSubmission(ip)) return redirect("/contact?error=limited");
  // A filled honeypot is a bot. Pretend it worked and do not send mail.
  if (field(form, "website").trim()) return redirect("/contact/thank-you");

  const captchaOk = await verifyTurnstile(field(form, "cf-turnstile-response"), ip);
  if (!captchaOk) return redirect("/contact?error=captcha");

  const result = await buildContactMail(
    {
      name: field(form, "name"),
      email: field(form, "email"),
      phoneNumber: field(form, "phoneNumber"),
      message: field(form, "message"),
      person: field(form, "person"),
    },
    {
      gmailAddress: process.env.GMAIL_EMAIL_ADDRESS ?? "",
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
    },
  );
  if (result.status === 400) return redirect("/contact?error=invalid");
  if (!result.mail.from) return redirect("/contact?error=send");

  try {
    const { createTransport } = await import("nodemailer");
    const transport: MailTransport = createTransport({
      host: process.env.GMAIL_EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.GMAIL_EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS ?? "",
        pass: process.env.GMAIL_EMAIL_PASSWORD ?? "",
      },
    });
    await transport.sendMail(result.mail);
  } catch {
    return redirect("/contact?error=send");
  }
  return redirect(result.location);
};
