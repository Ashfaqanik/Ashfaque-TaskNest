import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import Board from "./BoardView/BoardView";
import ModalNewTask from "../../components/ModalNewTask/ModalNewTask";
import ListView from "./ListView/ListView";
import TimeLineView from "./TimeLineView/TimeLineView";
import TableView from "./TableView/TableView";

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  if (!id) {
    return <p>Project ID not found.</p>;
  }

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <TimeLineView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
