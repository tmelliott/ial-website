import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { buttonClasses } from "./cn";

type ContactData = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  person: string;
};

export default function ContactForm({
  team,
  selected = "",
}: {
  team: { slug: string; name: string }[];
  selected?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue,
  } = useForm<ContactData>({
    defaultValues: {
      person: selected,
    },
  });

  useEffect(() => {
    const person = new URLSearchParams(window.location.search).get("person");
    if (person) setValue("person", person);
  }, [setValue]);

  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const validateContact = () => {
    if (!email && !phoneNumber) return "Please provide either email or phone number";
    return true;
  };

  return (
    <form
      ref={formRef}
      method="POST"
      action="/.netlify/functions/contact"
      autoComplete="off"
      onSubmit={handleSubmit(() => {
        formRef.current?.submit();
      })}
      className="w-full flex flex-col gap-4 text-base text-black md:grid md:grid-cols-3 md:text-xl md:gap-x-12 md:gap-y-12"
    >
      <label htmlFor="name" className="flex md:justify-end md:items-center">
        <div className="text-white font-bold">Name</div>
      </label>
      <input
        id="name"
        {...register("name", {
          required: true,
        })}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 md:col-span-2 rounded border-gray-400"
      />
      {errors.name?.message && (
        <div className="md:col-start-2 md:col-span-2 md:-mt-8 text-sm text-red-600">
          {errors.name.message}
        </div>
      )}

      <label htmlFor="email" className="flex md:justify-end md:items-center">
        <div className="text-white font-bold">*Email</div>
      </label>
      <input
        id="email"
        {...register("email", {
          validate: validateContact,
        })}
        type="email"
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 md:col-span-2 rounded border-gray-400"
      />

      <label htmlFor="phoneNumber" className="flex md:justify-end md:items-center">
        <div className="text-white font-bold">*Phone number</div>
      </label>
      <input
        id="phoneNumber"
        {...register("phoneNumber", {
          validate: validateContact,
        })}
        type="tel"
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 md:col-span-2 rounded border-gray-400"
      />
      {errors.phoneNumber && (
        <div className="md:col-start-2 md:col-span-2 md:-mt-8 text-sm text-red-600">
          {errors.phoneNumber.message}
        </div>
      )}

      <label htmlFor="person" className="flex md:justify-end md:items-center">
        <div className="text-white font-bold">Team member</div>
      </label>
      <select
        id="person"
        {...register("person")}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 w-full md:col-span-2 rounded border-gray-400"
      >
        <option value="">Admin / No-one in particular</option>
        {team.map((person) => (
          <option key={person.slug} value={person.slug}>
            {person.name}
          </option>
        ))}
      </select>
      <div className="md:col-span-3">
        <p className="text-sm md:-mt-8 md:text-right text-white">
          Optionally send the message directly to the chosen person.
        </p>
      </div>

      <label htmlFor="message" className="flex md:justify-end md:items-start md:pt-1">
        <div className="text-white font-bold">Message</div>
      </label>
      <textarea
        id="message"
        {...register("message", {
          required: true,
        })}
        rows={10}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 md:col-span-2 rounded border-gray-400"
      />

      <button
        className={buttonClasses(
          "primary",
          "filled",
          "md:col-start-2 md:col-span-2 bg-accent-700 hover:bg-accent-800",
        )}
      >
        {isSubmitting ? " ... " : "Submit your message"}
      </button>
    </form>
  );
}
