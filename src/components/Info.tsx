import Section from "./Section";
import { profile } from "../data/profile";

const Info = () => (
  <Section id="info" title="info">
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h3 className="mb-5 text-xl text-grey-0">Technical skills</h3>
        <ul className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <li key={skill} className="rounded-sm border border-violet-500/40 px-3 py-1 text-violet-300">
              {skill}
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center rounded-md border border-grey-100 px-5 text-lg transition-colors hover:border-violet-400 hover:text-violet-300"
        >
          View resume ↗
        </a>
      </div>

      <div>
        <h3 className="mb-5 text-xl text-grey-0">Education</h3>
        <ol className="space-y-8 border-l border-grey-700 pl-6">
          {profile.education.map((ed) => (
            <li key={ed.school} className="relative">
              <span className="absolute top-2 -left-[1.9rem] size-3 rounded-full bg-violet-500" aria-hidden="true" />
              <p className="font-bold text-grey-0">{ed.program}</p>
              <p className="text-sm text-violet-300">{ed.school}</p>
              <ul className="mt-2 space-y-1 text-grey-300">
                {ed.points.map((pt) => (
                  <li key={pt}>- {pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </Section>
);

export default Info;
