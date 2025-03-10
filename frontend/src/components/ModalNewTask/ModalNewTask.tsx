import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { Priority, Status, useCreateTaskMutation } from "../../state/api";
import { formatISO } from "date-fns";
import styles from "./ModalNewTask.module.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask: React.FC<Props> = ({ isOpen, onClose, id = null }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imgLoading, setImgLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setImgLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "taskmanagy");

    try {
      // Calling the backend API to upload to Cloudinary
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dpabqdea9/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrl(data.secure_url);
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setImgLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !authorUserId || !imageUrl || !(id !== null || projectId))
      return;

    try {
      const formattedStartDate = formatISO(new Date(startDate), {
        representation: "complete",
      });
      const formattedDueDate = formatISO(new Date(dueDate), {
        representation: "complete",
      });

      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: parseInt(authorUserId),
        assignedUserId: parseInt(assignedUserId),
        projectId: id !== null ? Number(id) : Number(projectId),
        image: imageUrl,
      }).unwrap();

      resetForm();
      onClose();
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus(Status.ToDo);
    setPriority(Priority.Backlog);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAuthorUserId("");
    setAssignedUserId("");
    setProjectId("");
    setImageUrl("");
  };

  const isFormValid = () => {
    return title && authorUserId && (id !== null || projectId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={styles.gridContainer}>
            <select
              className={`${styles.selectInput} modalContainerFormSelectInputColor`}
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="">Select Status</option>
              {Object.values(Status).map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
            <select
              className={`${styles.selectInput} modalContainerFormSelectInputColor`}
              value={priority}
              onChange={(e) =>
                setPriority(Priority[e.target.value as keyof typeof Priority])
              }
            >
              <option value="">Select Priority</option>
              {Object.values(Priority).map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>
                  {priorityOption}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className={styles.gridContainer}>
            <input
              type="date"
              className={`${styles.formInput} modalContainerFormInputColor`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className={`${styles.formInput} modalContainerFormInputColor`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Author User ID"
            value={authorUserId}
            onChange={(e) => setAuthorUserId(e.target.value)}
          />
          <input
            type="text"
            className={`${styles.formInput} modalContainerFormInputColor`}
            placeholder="Assigned User ID"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          />
          {id === null && (
            <input
              type="text"
              className={`${styles.formInput} modalContainerFormInputColor`}
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          )}
          {/* Image Upload Input */}
          <input
            type="file"
            className={`${styles.formInput} modalContainerFormInputColor`}
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                handleImageUpload(file);
              }
            }}
          />
          {imgLoading && <p>Uploading Image...</p>}{" "}
          {imageUrl && <p>Image uploaded successfully!</p>}{" "}
          <button
            type="submit"
            className={`${`${styles.formButton} modalContainerFormButtonColor`} ${
              (!isFormValid() || isLoading || !imageUrl) && styles.disabled
            }`}
            disabled={!isFormValid() || isLoading || !imageUrl}
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalNewTask;
