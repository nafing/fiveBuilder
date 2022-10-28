import React from "react";

const AppContext = React.createContext(null as any);

const ContextProvider = ({ children: Children }: any) => {
  const [state, setState] = React.useState({});

  return (
    <AppContext.Provider value={{ state, setState }}>
      {Children}
    </AppContext.Provider>
  );
};

export { AppContext, ContextProvider };
