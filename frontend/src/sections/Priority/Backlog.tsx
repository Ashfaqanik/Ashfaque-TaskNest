import PrioritiesPage from "./PrioritiesPage/PrioritiesPage";
import { Priority } from "../../state/api";

const Backlog = () => {
  return (
    <PrioritiesPage priority={Priority.Backlog} headerName="Backlog Priority" />
  );
};

export default Backlog;
