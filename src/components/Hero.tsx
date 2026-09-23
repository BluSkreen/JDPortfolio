import { profile } from "../data/profile";

// Each glyph gets its own span so the physics layer can pick it up and move it.
const Letters = ({ text }: { text: string }) => (
  <>
    {[...text].map((ch, i) => (
      <span key={i} data-letter className="inline-block">
        {ch}
      </span>
    ))}
  </>
);

const Hero = () => (
  <section id="home" className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 pt-16 sm:px-6">
    <p className="mb-4 text-sm text-violet-300 sm:text-base">Hi, my name is</p>

    <h1 className="leading-[0.9] font-bold tracking-tighter text-grey-100 text-[clamp(3.25rem,15vw,8.5rem)]">
      <span className="sr-only">
        {profile.firstName} {profile.lastName}
      </span>
      <span aria-hidden="true" className="block">
        <Letters text={`<${profile.firstName}`} />
      </span>
      <span aria-hidden="true" className="block sm:pl-[1.5em]">
        <Letters text={`${profile.lastName}/>`} />
      </span>
    </h1>

    <p className="mt-6 text-xl text-grey-0 sm:text-3xl">{profile.title}</p>

    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
      {profile.links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-2 text-violet-400 transition-colors hover:text-violet-300"
          >
            <img src={link.icon} alt="" className="size-6" />
            {link.handle}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default Hero;
