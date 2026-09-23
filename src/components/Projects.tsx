import Section from "./Section";
import { projects, type Project } from "../data/projects";

const ProjectCard = ({ project }: { project: Project }) => {
  const href = project.live ?? project.repo;
  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-grey-800 bg-grey-900/80 transition-colors hover:border-violet-500/60">
      <div className="aspect-video overflow-hidden bg-grey-800">
        {project.image ? (
          <img
            src={project.image}
            srcSet={`${project.image.replace(".webp", "-640.webp")} 640w, ${project.image} 1200w`}
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
            alt={project.imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-3xl text-violet-400" aria-hidden="true">
            {"</>"}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-grey-0">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-violet-300">
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        <p className="text-sm text-grey-300">{project.description}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="rounded-sm bg-violet-950/60 px-2 py-0.5 text-xs text-violet-300">
              {t}
            </li>
          ))}
        </ul>
        {(project.repo || project.live) && (
          <div className="flex gap-4 text-sm">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-violet-400 hover:text-violet-300">
                live ↗
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-violet-400 hover:text-violet-300">
                code ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const Projects = () => (
  <Section id="projects" title="projects">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.name} project={p} />
      ))}
    </div>
  </Section>
);

export default Projects;
