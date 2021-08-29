import React, { useState, createContext, useContext, ReactNode } from 'react';

export interface IAppContextValues {
  navBarOpen: boolean;
  setNavBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext({
  // eslint-disable-next-line no-unused-vars
  setNavBarOpen: (open: boolean) => {},
  navBarOpen: false,
});

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [navBarOpen, setNavBarOpen] = useState(false);

  const value: IAppContextValues = {
    navBarOpen,
    setNavBarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
