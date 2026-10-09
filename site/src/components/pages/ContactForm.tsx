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
      className="w-full grid grid-cols-3 text-xl gap-x-12 gap-y-12 text-black"
    >
      <label htmlFor="name" className="flex justify-end items-center">
        <div className="text-white font-bold">Name</div>
      </label>
      <input
        id="name"
        {...register("name", {
          required: true,
        })}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />
      {errors.name?.message && (
        <div className="col-start-2 col-span-2 -mt-8 text-sm text-red-600">
          {errors.name.message}
        </div>
      )}

      <label htmlFor="email" className="flex justify-end items-center">
        <div className="text-white font-bold">*Email</div>
      </label>
      <input
        id="email"
        {...register("email", {
          validate: validateContact,
        })}
        type="email"
        autoComplete="off"
        className=" focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />

      <label htmlFor="phoneNumber" className="flex justify-end items-center">
        <div className="text-white font-bold">*Phone number</div>
      </label>
      <input
        id="phoneNumber"
        {...register("phoneNumber", {
          validate: validateContact,
        })}
        type="tel"
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />
      {errors.phoneNumber && (
        <div className="col-start-2 col-span-2 -mt-8 text-sm text-red-600">
          {errors.phoneNumber.message}
        </div>
      )}

      <label htmlFor="person" className="flex justify-end items-center">
        <div className="text-white font-bold">Team member</div>
      </label>
      <select
        id="person"
        {...register("person")}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      >
        <option value="">Admin / No-one in particular</option>
        {team.map((person) => (
          <option key={person.slug} value={person.slug}>
            {person.name}
          </option>
        ))}
      </select>
      <div className="col-span-3">
        <p className="text-sm -mt-8 text-right text-white">
          Optionally send the message directly to the chosen person.
        </p>
      </div>

      <label htmlFor="message" className="flex justify-end items-start pt-1">
        <div className="text-white font-bold">Message</div>
      </label>
      <textarea
        id="message"
        {...register("message", {
          required: true,
        })}
        rows={10}
        autoComplete="off"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />

      <button
        className={buttonClasses(
          "primary",
          "filled",
          "col-start-2 col-span-2 bg-accent-700 hover:bg-accent-800",
        )}
      >
        {isSubmitting ? " ... " : "Submit your message"}
      </button>
    </form>
  );
}
