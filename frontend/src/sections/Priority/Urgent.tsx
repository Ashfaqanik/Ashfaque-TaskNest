import PrioritiesPage from "./PrioritiesPage/PrioritiesPage";
import { Priority } from "../../state/api";

const Urgent = () => {
  return (
    <PrioritiesPage priority={Priority.Urgent} headerName="Urgent Priority" />
  );
};

export default Urgent;
