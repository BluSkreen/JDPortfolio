import Section from "./Section";
import { profile } from "../data/profile";

const About = () => (
  <Section id="about" title="about">
    <div className="max-w-3xl space-y-5 text-base leading-relaxed text-grey-200 sm:text-lg">
      {profile.about.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  </Section>
);

export default About;
