"use client";

import Button from "@/app/(website)/components/Button";
import { useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export type ContactData = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  person: string;
};

export default function Form({
  action,
  team,
}: {
  action: SubmitHandler<ContactData>;
  team: { slug: string; name: string }[];
}) {
  const query = useSearchParams();
  const person = query.get("person");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<ContactData>({
    defaultValues: {
      person: person ?? "",
    },
  });

  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const validateContact = () => {
    if (!email && !phoneNumber)
      return "Please provide either email or phone number";
    return true;
  };

  return (
    <form
      onSubmit={handleSubmit(action)}
      className="w-full grid grid-cols-3 text-xl gap-x-12 gap-y-12 text-black"
    >
      {/* name */}
      <label htmlFor="name" className="flex justify-end items-center">
        <div className="text-accent-600 uppercase font-bold">Name</div>
      </label>
      <input
        {...register("name", {
          required: true,
        })}
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />
      {errors.name?.message && (
        <div className="col-start-2 col-span-2 -mt-8 text-sm text-red-600">
          {errors.name.message}
        </div>
      )}

      {/* email */}
      <label htmlFor="email" className="flex justify-end items-center">
        <div className="text-accent-600 uppercase font-bold">*Email</div>
      </label>
      <input
        {...register("email", {
          validate: validateContact,
        })}
        type="email"
        className=" focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />

      {/* phone */}
      <label htmlFor="phoneNumber" className="flex justify-end items-center">
        <div className="text-accent-600 uppercase font-bold">*Phone number</div>
      </label>
      <input
        {...register("phoneNumber", {
          validate: validateContact,
        })}
        type="tel"
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      />
      {errors.phoneNumber && (
        <div className="col-start-2 col-span-2 -mt-8 text-sm text-red-600">
          {errors.phoneNumber.message}
        </div>
      )}

      {/* who to contact */}
      <label htmlFor="person" className="flex justify-end items-center">
        <div className="text-accent-600 uppercase font-bold">Team member</div>
      </label>
      <select
        {...register("person")}
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      >
        <option value=""></option>
        {team.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      <div className="col-span-3">
        <p className="text-sm -mt-8 text-right text-white">
          Optionally send the message directly to the chosen person.
        </p>
      </div>

      {/* message */}
      <label htmlFor="message" className="flex justify-end items-start pt-1">
        <div className="text-accent-600 uppercase font-bold">Message</div>
      </label>
      <textarea
        {...register("message", {
          required: true,
        })}
        rows={10}
        className="focus:ring-accent-200 focus:ring focus:border-accent-300 outline-0 col-span-2 rounded border-gray-400"
      ></textarea>

      <Button
        type="primary"
        variant="filled"
        className="col-start-2 col-span-2 "
      >
        {isSubmitting ? " ... " : "Submit your message"}
      </Button>
    </form>
  );
}
