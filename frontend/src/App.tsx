import React, { useEffect } from "react";
import DashboardWrapper from "./sections/DashboardWrapper/DashboardWrapper";
import { SidebarProvider } from "./context/SidebarContext.tsx";
import { useAppDispatch, useAppSelector } from "./store/redux.tsx";
import { ToastContainer } from "react-toastify";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import { setIsLoggedIn } from "./state/globalReducer.ts";
import SignUp from "./pages/Register/Register";
import { jwtDecode } from "jwt-decode";

const metadata = {
  title: "Ashfaque TaskNest",
  description: "A react task management app",
};
const isTokenExpired = (token: string) => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

function App() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.global.isLoggedIn);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (token && userId && !isTokenExpired(token)) {
      dispatch(setIsLoggedIn(true));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      dispatch(setIsLoggedIn(false));
    }
  }, [dispatch]);
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoggedIn === false ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <SidebarProvider>
          <ProjectProvider>
            <DashboardWrapper />
          </ProjectProvider>
        </SidebarProvider>
      )}
    </div>
  );
}

export default App;
