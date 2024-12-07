import { Project } from "../../state/api";
import styles from "./ProjectCard.module.scss";
import { useAppSelector } from "../../store/redux";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div
      className={`${styles.projectContainer} ${isDarkMode ? styles.dark : ""}`}
    >
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
    </div>
  );
};

export default ProjectCard;
