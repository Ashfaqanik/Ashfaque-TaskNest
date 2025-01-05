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
  const [priority, setPriority] = useState("");
  const [query, setQuery] = useState("");

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
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setPriority={setPriority}
        setQuery={setQuery}
      />

      {activeTab === "Board" && (
        <Board
          id={id}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          priority={priority}
          query={query}
        />
      )}
      {activeTab === "List" && (
        <ListView
          id={id}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          priority={priority}
          query={query}
        />
      )}
      {activeTab === "Timeline" && (
        <TimeLineView
          id={id}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          priority={priority}
          query={query}
        />
      )}
      {activeTab === "Table" && (
        <TableView
          id={id}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          priority={priority}
          query={query}
        />
      )}
    </div>
  );
};

export default Project;
