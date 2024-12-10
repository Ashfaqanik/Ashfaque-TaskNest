import PrioritiesPage from "./PrioritiesPage/PrioritiesPage";
import { Priority } from "../../state/api";

const High = () => {
  return <PrioritiesPage priority={Priority.High} headerName="High Priority" />;
};

export default High;
