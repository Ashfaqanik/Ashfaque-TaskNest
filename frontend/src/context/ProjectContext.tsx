import React, { createContext, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/redux";
import { setProjectName, setTeamId } from "../state/globalReducer";

interface ProjectContextType {
  projectName: string;
  teamId: number;
  setProjectName: (name: string) => void;
  setTeamId: (id: number) => void;
}

// Create ProjectContext
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// ProjectProvider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const projectName = useAppSelector((state) => state.global.projectName);
  const teamId = useAppSelector((state) => state.global.teamId);

  // Handlers accept new values and dispatch them
  const setProjectNameHandler = (name: string) => {
    dispatch(setProjectName(name));
  };

  const setTeamIdHandler = (id: number) => {
    dispatch(setTeamId(id));
  };

  return (
    <ProjectContext.Provider
      value={{
        projectName,
        teamId,
        setProjectName: setProjectNameHandler,
        setTeamId: setTeamIdHandler,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the ProjectContext
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
