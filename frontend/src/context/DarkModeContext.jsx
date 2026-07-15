import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("pipelineiq-dark") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("pipelineiq-dark", dark);
  }, [dark]);

  const toggleDark = () => setDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};
