import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { useCreateTeamMutation } from "../../state/api";
import styles from "./ModalNewTeam.module.scss";
import { useCreateTeamMutation } from "../../state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  const handleSubmit = async () => {
    if (!teamName || !productOwnerUserId || !projectManagerUserId) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await createTeam({
        teamName,
        productOwnerUserId: parseInt(productOwnerUserId),
        projectManagerUserId: parseInt(projectManagerUserId),
      }).unwrap();

      resetForm();
      onClose();
      toast.success("Team created successfully.");
    } catch (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        "Something went wrong.";

      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setTeamName("");
    setProductOwnerUserId("");
    setProjectManagerUserId("");
  };

  const isFormValid = () => {
    return teamName && productOwnerUserId && projectManagerUserId;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
      <div className={styles.modalContainer}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Product Owner User ID"
            value={productOwnerUserId}
            onChange={(e) => setProductOwnerUserId(e.target.value)}
          />
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Project Manager User ID"
            value={projectManagerUserId}
            onChange={(e) => setProjectManagerUserId(e.target.value)}
          />
          <button
            type="submit"
            className={`${`${styles.formButton} modalContainerFormButtonColor`} ${
              (!isFormValid() || isLoading) && styles.disabled
            }`}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? "Creating..." : "Create Team"}
            Create Team
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalNewTeam;
