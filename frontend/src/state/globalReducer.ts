import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isLoggedIn: boolean;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  projectName: string;
  teamId: number;
}

const initialState: initialStateTypes = {
  isLoggedIn: false,
  isSidebarCollapsed: true,
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  projectName: "",
  teamId: 0,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    setTeamId: (state, action: PayloadAction<number>) => {
      state.teamId = action.payload;
    },
  },
});

export const {
  setIsLoggedIn,
  setIsSidebarCollapsed,
  setIsDarkMode,
  setProjectName,
  setTeamId,
} = globalSlice.actions;
export default globalSlice.reducer;
