import React, { createContext, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { AUTH_TOKEN_KEY, USER_ID, USER_NAME } from "../constants/constants";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = async () => {
    // Simulate a login action
    setIsLoggedIn(true);
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
