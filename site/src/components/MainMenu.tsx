import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SubmenuItem = {
  id?: string | null;
  label: string;
  location: string;
};

type MenuItem = {
  id?: string | null;
  label: string;
  location: string;
  tereo?: string | null;
  submenu?: SubmenuItem[] | null;
};

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
        "opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200",
      )}
      onMouseEnter={clampToViewport}
    >
      <div
        ref={menuRef}
        style={offsetX ? { transform: `translateX(${offsetX}px)` } : undefined}
        className="min-w-[200px] max-w-[calc(100vw-2rem)] bg-accent-900/95 backdrop-blur-sm rounded shadow-lg border border-white/10"
      >
        {submenu.map((subItem) => (
          <a
            key={subItem.id}
            href={subItem.location}
            className="block px-4 py-2 text-sm hover:bg-accent-700 hover:text-accent-100 first:rounded-t last:rounded-b whitespace-nowrap"
          >
            {subItem.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MainMenu({ items }: { items?: MenuItem[] | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        className="lg:hidden relative z-[1001] min-h-11 px-3 cursor-pointer"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-[999] bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}
      <nav
        className={cn(
          "flex items-end lg:items-center gap-2 flex-col bg-black z-[1000] overflow-y-auto rounded shadow border border-white/10 lg:border-none lg:bg-transparent lg:flex-row lg:overflow-visible fixed lg:relative top-0 right-0 lg:translate-x-0 h-dvh lg:h-auto w-[min(100vw-2rem,20rem)] lg:w-auto transition px-6 pt-[var(--header-height)] lg:pt-0 lg:gap-8",
          open
            ? "translate-x-0"
            : "translate-x-full invisible pointer-events-none lg:visible lg:pointer-events-auto lg:translate-x-0",
        )}
      >
        {items?.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <div key={item.id} className="relative group w-full lg:w-auto">
              {hasSubmenu ? (
                <div className="w-full">
                  <a
                    href={item.location}
                    className="flex flex-col items-end lg:items-start hover:bg-accent-700 rounded p-2 hover:text-accent-100"
                  >
                    <div className="text-sm">{item.tereo}</div>
                    <div className="text-accent-500 group-hover:text-white">
                      {item.label}
                    </div>
                  </a>
                  <div className="lg:hidden w-full pr-2 pt-0 pb-2 space-y-1 flex flex-col items-end">
                    {item.submenu?.map((subItem) => (
                      <a
                        key={subItem.id}
                        href={subItem.location}
                        className="block text-sm text-accent-400 italic hover:text-accent-100 py-3 text-right"
                        onClick={() => setOpen(false)}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                  <DesktopSubmenu submenu={item.submenu ?? []} />
                </div>
              ) : (
                <a
                  href={item.location}
                  className="flex flex-col items-end lg:items-start hover:bg-accent-700 rounded p-2 hover:text-accent-100 group"
                  onClick={() => setOpen(false)}
                >
                  <div className="text-sm">{item.tereo}</div>
                  <div className="text-accent-500 group-hover:text-white">
                    {item.label}
                  </div>
                </a>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
