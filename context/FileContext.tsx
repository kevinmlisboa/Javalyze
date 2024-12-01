"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type FileContextType = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  clearFile: () => void; 
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const clearFile = () => {
    setFile(null);
  };

  return (
    <FileContext.Provider value={{ file, setFile, clearFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("FileContext must be used within FileContextProvider");
  }

  return context;
};
