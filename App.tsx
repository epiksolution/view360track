import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import NavigationRoute from "./src/navigations/index";
import { useCallback, useEffect, useState, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions, Animated, Easing, Text, StyleSheet } from "react-native";
import { createLocationTable } from "./src/utils/SQLiteService";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const logoOpacity = useState(new Animated.Value(0))[0];
  const logoScale = useState(new Animated.Value(0.8))[0]; // Start slightly smaller

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate some async tasks (e.g., fetching data, loading fonts)
        // In a real app, you might replace this with actual data loading
        await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay for demonstration

        // Start logo animation after a short delay to ensure it's rendered
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000, // Fade in duration
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1.1, // Slightly larger than original size
            friction: 4, // Controls the "bounciness"
            tension: 50, // Controls the speed of the spring
            useNativeDriver: true,
          }),
        ]).start(() => {
          // After the initial animation, revert to original size and then scale down
          Animated.sequence([
            Animated.timing(logoScale, {
              toValue: 1, // Back to original size
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 0.8, // Scale down slightly before fading out
              duration: 500,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]).start();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000)); // Short delay for demonstration

        setAppIsReady(true);
        console.log("App is ready");
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        // This is important even if you have a separate loading screen,
        // as it signals that the initial setup is complete.
        // We'll hide the splash screen in onLayoutRootView.
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    createLocationTable();
  }, []);

  return (
    <>
      {appIsReady ? (
        <AuthProvider>
          <NavigationRoute />
          <StatusBar style="auto" />
        </AuthProvider>
      ) : (
        <Animated.View style={[styles.container, { opacity: logoOpacity }]}>
          <Animated.Image
            source={require("./assets/logo.png")} // Your logo image for animation
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
          />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Should match your app.json splash background
  },
  logo: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    resizeMode: "contain",
  },
  appName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  mainText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
