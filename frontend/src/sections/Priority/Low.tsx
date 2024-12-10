import PrioritiesPage from "./PrioritiesPage/PrioritiesPage";
import { Priority } from "../../state/api";

const Low = () => {
  return <PrioritiesPage priority={Priority.Low} headerName="Low Priority" />;
};

export default Low;
