function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const phoneNumber = String(form.get("phoneNumber") ?? "");
  const message = String(form.get("message") ?? "");
  const person = String(form.get("person") ?? "");

  if (!name || !message || (!email && !phoneNumber)) {
    return new Response("Name, message, and an email or phone number are required.", {
      status: 400,
    });
  }

  const payloadUrl = (process.env.PAYLOAD_URL || "https://admin.inzight.co.nz").replace(
    /\/$/,
    "",
  );
  let sendTo;
  if (person) {
    const lookup = new URL("/api/team", `${payloadUrl}/`);
    lookup.searchParams.set("limit", "1");
    lookup.searchParams.set("depth", "0");
    lookup.searchParams.set("where[slug][equals]", person);
    const response = await fetch(lookup);
    if (response.ok) {
      const data = await response.json();
      sendTo = data.docs?.[0]?.email || undefined;
    }
  }

  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({
    host: process.env.GMAIL_EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.GMAIL_EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_EMAIL_ADDRESS,
      pass: process.env.GMAIL_EMAIL_PASSWORD,
    },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phoneNumber);
  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: process.env.GMAIL_EMAIL_ADDRESS,
    replyTo: email || undefined,
    to: sendTo || process.env.GMAIL_EMAIL_ADDRESS,
    cc: sendTo ? process.env.GMAIL_EMAIL_ADDRESS : undefined,
    subject: "Contact Form Submission",
    text: `From: ${name} <${email}>\nPhone: ${phoneNumber}\n\n${message}`,
    html: `<div><p>From: ${safeName} &lt;${safeEmail}&gt;</p>${
      phoneNumber ? `<p>Phone: ${safePhone}</p>` : ""
    }<p>Message:</p><p>${safeMessage}</p></div>`,
  });

  return new Response(null, {
    status: 303,
    headers: { Location: "/contact/thank-you" },
  });
};
