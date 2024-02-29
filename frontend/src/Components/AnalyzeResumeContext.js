import { createContext, useContext, useState } from 'react';

const AnalyzeResumeContext = createContext();

export const AnalyzeResumeProvider = ({ children }) => {
  const [analyzeResumeClicked, setAnalyzeResumeClicked] = useState(false);

  function clickAnalyzeResume(){
    setAnalyzeResumeClicked(true);
  };

  return (
    <AnalyzeResumeContext.Provider value={{ analyzeResumeClicked, clickAnalyzeResume, setAnalyzeResumeClicked }}>
      {children}
    </AnalyzeResumeContext.Provider>
  );
};

export const useAnalyzeResume = () => useContext(AnalyzeResumeContext);
