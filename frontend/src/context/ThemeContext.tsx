import React, { createContext, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/redux";
import { setIsDarkMode } from "../state/globalReducer";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleThemeHandler = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme: toggleThemeHandler }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
