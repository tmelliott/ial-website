import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import nodemailer from "nodemailer";
import Form, { ContactData } from "./components/form";
import { Suspense } from "react";

export default async function Page() {
  const payload = await getPayload({ config });
  const ourTeam = await payload.find({
    collection: "team",
    sort: "order",
    where: {
      email: {
        not_equals: "",
      },
    },
  });

  const team = ourTeam.docs.map((p) => ({
    slug: p.slug,
    name: p.fullname,
  }));

  const submitContactForm = async (data: ContactData) => {
    "use server";

    const payload = await getPayload({ config });
    const person =
      data.person !== ""
        ? await payload.find({
            collection: "team",
            where: {
              slug: {
                equals: data.person,
              },
            },
            limit: 1,
          })
        : undefined;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: Number(process.env.GMAIL_EMAIL_PORT) || 0,
      secure: false,
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
      },
    });

    const dataName = data.name;
    const dataEmail = data.email;
    const dataPhone = data.phoneNumber;
    const dataMessage = data.message;

    if (typeof dataName !== "string") return;
    if (dataEmail && typeof dataEmail !== "string") return;
    if (dataPhone && typeof dataPhone !== "string") return;
    if (typeof dataMessage !== "string") return;

    const sendTo = person ? person.docs[0].email : undefined;

    const info = await transporter.sendMail({
      from: dataName,
      replyTo: dataEmail ?? "",
      to: sendTo ?? process.env.GMAIL_EMAIL_ADDRESS,
      cc: sendTo ? process.env.GMAIL_EMAIL_ADDRESS : undefined,
      subject: "Contact Form Submission",
      text: dataMessage,
      html: `<div>
        <p>From: ${dataName} &lt;${dataEmail}&gt;</p>
        ${dataPhone && `<p>Phone: ${dataPhone}</p>`}
        <p>Message:</p>
        <p>${dataMessage}</p>
        </div>`,
    });

    if (info.accepted.length) {
      redirect("/contact/thank-you");
    }

    console.log("ERROR");
  };

  return (
    <Suspense fallback="Loading ...">
      <Form action={submitContactForm} team={team} />
    </Suspense>
  );
}
