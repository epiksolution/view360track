import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import NavigationRoute from "./src/navigations/index";
import { useEffect } from "react";

import { createLocationTable } from "./src/utils/SQLiteService";

export default function App() {
  useEffect(() => {
    createLocationTable();
  }, []);

  return (
    <AuthProvider>
      <NavigationRoute />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
