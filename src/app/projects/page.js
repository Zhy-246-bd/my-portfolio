import { projects } from "@/data/projects";
import ProjectStack from "@/components/studio/ProjectStack";
import styles from "@/components/studio/projects.module.css";

export const metadata = { title: "项目成果" };

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <ProjectStack projects={projects} />

      <section className={styles.projectIndex} aria-label="项目索引">
        <div className={styles.indexHead}>
          <span>PROJECT INDEX</span>
          <span>OPEN A PIECE</span>
        </div>

        {projects.map((project, index) => (
          <a
            key={project.id}
            href={project.entry || `#${project.id}`}
            target={project.entry ? "_blank" : undefined}
            rel={project.entry ? "noopener noreferrer" : undefined}
            className={styles.indexRow}
          >
            <span className={styles.indexNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{project.name}</strong>
            <small>{project.summary}</small>
            <span className={styles.indexArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </section>
    </div>
  );
}
