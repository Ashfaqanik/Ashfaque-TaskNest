import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import Board from "../../sections/projectSections/BoardView/BoardView";
// import List from "./ListView";
// import Timeline from "./TimelineView";
// import Table from "./TableView";
import ModalNewTask from "../../components/ModalNewTask/ModalNewTask";

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
      {/* {activeTab === "List" && (
          <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "Timeline" && (
          <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "Table" && (
          <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )} */}
    </div>
  );
};

export default Project;
