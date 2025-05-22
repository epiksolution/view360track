import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthProvider } from './src/context/AuthContext';
import NavigationRoute from "./src/navigations/index";

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoute />
      <StatusBar style="auto" />  
    </AuthProvider>
  );
}