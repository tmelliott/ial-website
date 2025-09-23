"use client";

import { General } from "@payload-types";
import Link from "next/link";
import { useState } from "react";
import cn from "../../utils/cn";

type MenuProps = {
  items: General["mainMenu"];
};
export default function MainMenu({ items }: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="lg:hidden cursor-pointer" onClick={() => setOpen(true)}>
        Menu
      </div>
      <nav
        className={cn(
          "flex items-end lg:items-center gap-2 flex-col bg-black/20 z-[1000] backdrop-blur-sm rounded shadow border border-white/10 lg:border-none lg:backdrop-blur-none lg:bg-none lg:flex-row fixed lg:relative top-0 right-0 lg:translate-x-0 h-screen lg:h-auto transition px-6 lg:gap-8",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div
          className="lg:hidden cursor-pointer h-[var(--header-height)] flex items-center -mb-6"
          onClick={() => setOpen(false)}
        >
          Close
        </div>
        {items &&
          items.map((item) => (
            <Link
              href={item.location}
              key={item.id}
              className="flex flex-col items-end lg:items-start hover:bg-accent-700  rounded p-2 hover:text-accent-100 group"
            >
              <div className="text-sm">{item.tereo}</div>
              <div className="text-accent-500 group-hover:text-white">
                {item.label}
              </div>
            </Link>
          ))}
      </nav>
    </div>
  );
}
