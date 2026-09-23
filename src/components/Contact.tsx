import Section from "./Section";
import { profile } from "../data/profile";

const Contact = () => (
  <Section id="contact" title="contact">
    <p className="max-w-xl text-lg text-grey-200">
      Have a project, a role, or just want to talk shop? My inbox is open.
    </p>
    <a
      href={`mailto:${profile.email}`}
      className="mt-8 inline-flex min-h-11 items-center rounded-md bg-violet-600 px-6 text-lg font-bold text-grey-0 transition-colors hover:bg-violet-500"
    >
      Say hello
    </a>
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-grey-800 pt-6 text-sm text-grey-500">
      <span>
        © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
      </span>
      <ul className="flex gap-4">
        {profile.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-violet-300"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  </Section>
);

export default Contact;
