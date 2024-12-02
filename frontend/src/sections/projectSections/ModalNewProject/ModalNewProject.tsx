import { useState } from "react";
import { useCreateProjectMutation } from "../../../state/api";
import { formatISO } from "date-fns";
import { useAppSelector } from "../../../store/redux";
import Modal from "../../../components/Modal/Modal";
import styles from "./ModalNewProject.module.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalNewProject({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    try {
      const formattedStartDate = formatISO(new Date(startDate), {
        representation: "complete",
      });
      const formattedEndDate = formatISO(new Date(endDate), {
        representation: "complete",
      });
      await createProject({
        name: projectName,
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).unwrap();

      resetForm();
      // Closing the modal
      onClose();
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
    }
  };
  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };
  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className={styles.modalForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={`${styles.inputStyles} ${isDarkMode ? styles.dark : ""}`}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={`${styles.inputStyles} ${isDarkMode ? styles.dark : ""}`}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div
          className={`${styles.dateInputs} ${isDarkMode ? styles.dark : ""}`}
        >
          <input
            type="date"
            className={`${styles.inputStyles} ${isDarkMode ? styles.dark : ""}`}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={`${styles.inputStyles} ${isDarkMode ? styles.dark : ""}`}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`${styles.submitButton} ${isDarkMode ? styles.dark : ""} ${
            !isFormValid() || isLoading ? styles.disabled : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
}
