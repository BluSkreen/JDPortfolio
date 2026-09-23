import { useEffect, useState } from "react";
import { profile } from "../data/profile";

const navItems = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
  { id: "info", label: "info" },
  { id: "contact", label: "contact" },
];

function useActiveSection() {
  const [inBand, setInBand] = useState("home");
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setInBand(entry.target.id);
        }
      },
      // A section counts as active when it crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    // The last section is too short to reach the middle band, so the page bottom selects it.
    const onScroll = () => {
      const doc = document.documentElement;
      setAtBottom(window.innerHeight + window.scrollY >= doc.scrollHeight - 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return atBottom ? navItems[navItems.length - 1].id : inBand;
}

const Nav = () => {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = (id: string) =>
    "transition-colors hover:text-violet-300 " + (active === id ? "text-violet-400" : "text-grey-100");

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-grey-800/60 bg-grey-900/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#home" className="flex min-h-11 items-center text-lg font-bold text-grey-0" onClick={() => setOpen(false)}>
          {"<"}
          {profile.firstName[0]}
          {profile.lastName[0]}
          <span className="text-violet-400">/</span>
          {">"}
        </a>

        <ul className="hidden gap-6 md:flex">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className={linkClass(id)} aria-current={active === id ? "true" : undefined}>
                // {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span className={"absolute left-0 h-0.5 w-6 bg-grey-0 transition-transform " + (open ? "top-2 rotate-45" : "top-0")} />
            <span className={"absolute top-2 left-0 h-0.5 w-6 bg-grey-0 transition-opacity " + (open ? "opacity-0" : "")} />
            <span className={"absolute left-0 h-0.5 w-6 bg-grey-0 transition-transform " + (open ? "top-2 -rotate-45" : "top-4")} />
          </span>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-4rem)] bg-grey-900 md:hidden">
          <ul className="flex flex-col gap-2 px-6 pt-8 text-2xl">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={"block py-3 " + linkClass(id)} onClick={() => setOpen(false)}>
                  // {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Nav;
