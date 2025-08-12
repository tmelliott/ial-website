import { redirect } from "next/navigation";

import nodemailer from "nodemailer";

export default async function Page() {
  const submitContactForm = async (data: FormData) => {
    "use server";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: Number(process.env.GMAIL_EMAIL_PORT) || 0,
      secure: false,
      auth: {
        user: process.env.GMAIL_EMAIL_ADDRESS,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
      },
    });

    const dataName = data.get("name");
    const dataEmail = data.get("email");
    const dataPhone = data.get("phone");
    const dataMessage = data.get("message");

    if (typeof dataName !== "string") return;
    if (dataEmail && typeof dataEmail !== "string") return;
    if (dataPhone && typeof dataPhone !== "string") return;
    if (typeof dataMessage !== "string") return;

    const info = await transporter.sendMail({
      from: dataName,
      replyTo: dataEmail ?? "",
      to: process.env.GMAIL_EMAIL_ADDRESS,
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
    <form
      action={submitContactForm}
      className="w-full grid grid-cols-3 text-xl gap-x-12 gap-y-12"
    >
      {/* name */}
      <label htmlFor="name" className="flex justify-end items-center">
        <div className="text-accent-800 uppercase font-bold">Name</div>
      </label>
      <input
        name="name"
        type="text"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />

      {/* email */}
      <label htmlFor="email" className="flex justify-end items-center">
        <div className="text-accent-800 uppercase font-bold">*Email</div>
      </label>
      <input
        name="email"
        type="email"
        className=" focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />

      {/* phone */}
      <label htmlFor="phone" className="flex justify-end items-center">
        <div className="text-accent-800 uppercase font-bold">*Phone number</div>
      </label>
      <input
        name="phone"
        type="tel"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />
      <div className="col-span-3">
        <p className="text-sm -mt-8 text-right">
          *Please provide either email or phone number.
        </p>
      </div>

      {/* message */}
      <label htmlFor="message" className="flex justify-end items-start pt-1">
        <div className="text-accent-800 uppercase font-bold">Message</div>
      </label>
      <textarea
        name="message"
        rows={10}
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      ></textarea>

      {/* TODO: use a client component with state to display loading of form */}
      <button className="col-start-2 col-span-2 border bg-accent-700 p-2 rounded text-white font-bold cursor-pointer">
        Submit your message
      </button>
    </form>
  );
}
