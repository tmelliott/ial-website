"use client";

import { General } from "@payload-types";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import cn from "../../utils/cn";

type SubmenuItem = NonNullable<
  NonNullable<General["mainMenu"]>[number]["submenu"]
>[number];

function DesktopSubmenu({ submenu }: { submenu: SubmenuItem[] }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);

  const clampToViewport = useCallback(() => {
    const menu = menuRef.current;
    if (!menu) return;

    setOffsetX(0);

    requestAnimationFrame(() => {
      const el = menuRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const padding = 16;
      let shift = 0;

      if (rect.right > window.innerWidth - padding) {
        shift -= rect.right - (window.innerWidth - padding);
      }
      if (rect.left + shift < padding) {
        shift += padding - (rect.left + shift);
      }

      setOffsetX(shift);
    });
  }, []);

  useLayoutEffect(() => {
    clampToViewport();
    window.addEventListener("resize", clampToViewport);
    return () => window.removeEventListener("resize", clampToViewport);
  }, [clampToViewport, submenu]);

  return (
    <div
      className={cn(
        "hidden lg:block absolute top-full right-0 pt-2 z-[1001]",
        "opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200"
      )}
      onMouseEnter={clampToViewport}
    >
      <div
        ref={menuRef}
        style={offsetX ? { transform: `translateX(${offsetX}px)` } : undefined}
        className="min-w-[200px] max-w-[calc(100vw-2rem)] bg-accent-900/95 backdrop-blur-sm rounded shadow-lg border border-white/10"
      >
        {submenu.map((subItem) => (
          <Link
            key={subItem.id}
            href={subItem.location}
            className="block px-4 py-2 text-sm hover:bg-accent-700 hover:text-accent-100 first:rounded-t last:rounded-b whitespace-nowrap"
          >
            {subItem.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

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
          items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div
                key={item.id}
                className="relative group w-full lg:w-auto"
              >
                {hasSubmenu ? (
                  <div className="w-full">
                    <Link
                      href={item.location}
                      className="flex flex-col items-end lg:items-start hover:bg-accent-700 rounded p-2 hover:text-accent-100"
                    >
                      <div className="text-sm">{item.tereo}</div>
                      <div className="text-accent-500 group-hover:text-white">
                        {item.label}
                      </div>
                    </Link>
                    {/* Mobile: submenu items shown directly underneath */}
                    <div className="lg:hidden w-full pr-2 pt-0 pb-2 space-y-1 flex flex-col items-end">
                      {item.submenu?.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.location}
                          className="block text-sm text-accent-400 italic hover:text-accent-100 py-1 text-right"
                          onClick={() => setOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                    {/* Desktop: dropdown menu with padding bridge for hover */}
                    <DesktopSubmenu submenu={item.submenu ?? []} />
                  </div>
                ) : (
                  <Link
                    href={item.location}
                    className="flex flex-col items-end lg:items-start hover:bg-accent-700 rounded p-2 hover:text-accent-100 group"
                    onClick={() => setOpen(false)}
                  >
                    <div className="text-sm">{item.tereo}</div>
                    <div className="text-accent-500 group-hover:text-white">
                      {item.label}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
      </nav>
    </div>
  );
}
