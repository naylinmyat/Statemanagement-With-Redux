"use client"
import React, { createContext, useState, useContext, useEffect } from "react";
import { LightTheme, DarkTheme } from "../utils/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [currentTheme, setCurrentTheme] = useState(theme); 

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from LocalStorage", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if(theme === "dark"){
      setCurrentTheme(DarkTheme);
    }else{
      setCurrentTheme(LightTheme);
    }
  }, [theme])

  // Toggle theme and save it to LocalStorage
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme to LocalStorage", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
