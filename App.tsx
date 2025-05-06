import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import NavigationRoute from "./src/navigations/index";

export default function App() {
  return (
    <>
      <NavigationRoute />
      <StatusBar style="auto" />  
    </>
  );
}