import React from "react";
import DashboardWrapper from "./sections/DashboardWrapper/DashboardWrapper";
import { SidebarProvider } from "./context/SidebarContext.tsx";
import { useAppSelector } from "./store/redux.tsx";
import { ToastContainer } from "react-toastify";
import { ProjectProvider } from "./context/ProjectContext.tsx";

const metadata = {
  title: "Ashfaque TaskNest",
  description: "A react task management app",
};
function App() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  React.useEffect(() => {
    const root = document.documentElement;
    root.className = isDarkMode ? "dark" : "light";
    document.title = metadata.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description);
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = metadata.description;
      document.head.appendChild(newMetaDescription);
    }
  }, [isDarkMode]);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <SidebarProvider>
        <ProjectProvider>
          <DashboardWrapper />
        </ProjectProvider>
      </SidebarProvider>
    </div>
  );
}

export default App;
