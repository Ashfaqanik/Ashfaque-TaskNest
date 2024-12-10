import PrioritiesPage from "./PrioritiesPage/PrioritiesPage";
import { Priority } from "../../state/api";

const Medium = () => {
  return (
    <PrioritiesPage priority={Priority.Medium} headerName="Medium Priority" />
  );
};

export default Medium;
