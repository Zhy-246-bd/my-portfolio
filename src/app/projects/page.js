import { projects } from "@/data/projects";
import ProjectStack from "@/components/studio/ProjectStack";
import ProjectDetail from "@/components/studio/ProjectDetail";
import styles from "@/components/studio/projects.module.css";

export const metadata = { title: "项目成果" };

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <ProjectStack projects={projects} />
      <ProjectDetail projects={projects} />
    </div>
  );
}
