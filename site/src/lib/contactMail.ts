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

// One plain mailbox. Commas, brackets, quotes, and comments are how a
// mailer turns one field into extra addresses, so they are not allowed.
const MAILBOX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s().-]{5,30}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LINE = /[\u0000-\u001F\u007F\u0085\u2028\u2029]/;
const MESSAGE_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0085\u2028\u2029]/;

function mailbox(value: string): string | null {
  if (!value || value.length > 254 || !MAILBOX.test(value)) return null;
  return value;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function singleLine(value: string, max: number): string | null {
  if (!value || value.length > max || LINE.test(value)) return null;
  return value;
}

export async function buildContactMail(
  fields: ContactFields,
  deps: {
    gmailAddress: string;
    lookupTeamEmail: (slug: string) => Promise<string | undefined>;
  },
): Promise<ContactResult> {
  const name = singleLine(text(fields.name), 100);
  const emailRaw = text(fields.email);
  const phoneRaw = text(fields.phoneNumber);
  const message = text(fields.message);
  const personRaw = text(fields.person);
  const email = emailRaw ? mailbox(emailRaw) : "";
  const phoneNumber = phoneRaw ? singleLine(phoneRaw, 40) : "";
  const person = personRaw ? singleLine(personRaw, 80) : "";

  if (
    !name ||
    !message ||
    message.length > 4000 ||
    MESSAGE_CONTROL.test(message) ||
    (!email && !phoneNumber) ||
    (emailRaw && !email) ||
    (phoneRaw && !phoneNumber) ||
    (phoneNumber && !PHONE.test(phoneNumber)) ||
    (personRaw && (!person || !SLUG.test(person)))
  ) {
    return {
      status: 400,
      body: "Name, message, and an email or phone number are required.",
    };
  }

  const inbox = mailbox(text(deps.gmailAddress)) ?? "";
  let sendTo = "";
  if (person) {
    const found = await deps.lookupTeamEmail(person);
    sendTo = mailbox(text(found)) ?? "";
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phoneNumber);
  const safeMessage = escapeHtml(message);

  return {
    status: 303,
    location: "/contact/thank-you",
    mail: {
      from: inbox,
      replyTo: email || undefined,
      to: sendTo || inbox,
      cc: sendTo && inbox ? inbox : undefined,
      subject: "Contact Form Submission",
      text: `From: ${name} <${email}>\nPhone: ${phoneNumber}\n\n${message}`,
      html: `<div><p>From: ${safeName} &lt;${safeEmail}&gt;</p>${
        phoneNumber ? `<p>Phone: ${safePhone}</p>` : ""
      }<p>Message:</p><p>${safeMessage}</p></div>`,
    },
  };
}
