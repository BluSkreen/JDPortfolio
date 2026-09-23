import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

const Section = ({ id, title, children }: SectionProps) => (
  <section id={id} className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
    <h2 data-reveal className="mb-10 text-2xl font-bold text-grey-0 sm:text-3xl">
      <span className="text-violet-400">// </span>
      {title}
    </h2>
    <div data-reveal>{children}</div>
  </section>
);

export default Section;
