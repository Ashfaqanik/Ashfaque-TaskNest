import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globalStyles/index.scss";
import { BrowserRouter } from "react-router-dom";
import StoreProvider from "./store/redux";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SidebarProvider } from "./context/SidebarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ThemeProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </ThemeProvider>
      </StoreProvider>
    </BrowserRouter>
    ,
  </StrictMode>
);
