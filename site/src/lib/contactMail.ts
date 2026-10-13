export type ContactFields = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  person: string;
};

export type ContactMail = {
  from: string;
  replyTo?: string;
  to: string;
  cc?: string;
  subject: string;
  text: string;
  html: string;
};

export type ContactResult =
  | { status: 400; body: string }
  | { status: 303; location: "/contact/thank-you"; mail: ContactMail };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char] as string;
  });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function buildContactMail(
  fields: ContactFields,
  deps: {
    gmailAddress: string;
    lookupTeamEmail: (slug: string) => Promise<string | undefined>;
  },
): Promise<ContactResult> {
  const name = text(fields.name);
  const email = text(fields.email);
  const phoneNumber = text(fields.phoneNumber);
  const message = text(fields.message);
  const person = text(fields.person);

  if (!name || !message || (!email && !phoneNumber)) {
    return {
      status: 400,
      body: "Name, message, and an email or phone number are required.",
    };
  }

  let sendTo: string | undefined;
  if (person) {
    const found = await deps.lookupTeamEmail(person);
    if (found) sendTo = found;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phoneNumber);
  const safeMessage = escapeHtml(message);

  return {
    status: 303,
    location: "/contact/thank-you",
    mail: {
      from: deps.gmailAddress,
      replyTo: email || undefined,
      to: sendTo || deps.gmailAddress,
      cc: sendTo ? deps.gmailAddress : undefined,
      subject: "Contact Form Submission",
      text: `From: ${name} <${email}>\nPhone: ${phoneNumber}\n\n${message}`,
      html: `<div><p>From: ${safeName} &lt;${safeEmail}&gt;</p>${
        phoneNumber ? `<p>Phone: ${safePhone}</p>` : ""
      }<p>Message:</p><p>${safeMessage}</p></div>`,
    },
  };
}
