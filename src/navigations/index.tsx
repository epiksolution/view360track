import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";
import { Image } from "react-native";

import LoginScreen from "../pages/login/index";
import HomeScreen from "../pages/home/index";
import AboutScreen from "../pages/about";
import ProfileScreen from "../pages/profile";
import { AuthContext } from '../context/AuthContext';
import { AUTH_TOKEN_KEY } from "../constants/constants";

const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { userName } = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Home"
        component={(props: any) => (
          <HomeScreen {...props} />
        )}
        options={{
          headerShown: true,
          title: `Welcome, ${userName}`,
          headerShadowVisible: false,
          headerLeft: () => (
            <Image
              style={{
                width: 30,
                height: 30,
                marginLeft: 10,
                marginRight: 5,
              }}
              source={require("../../assets/logo-sm.png")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: `About`,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: `Profile`,
        }}
      />
    </Stack.Navigator>
  );
}

export default function NavigationRoute() {
  const { login, logout, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (authToken) {
      login();
    } else {
      logout();
    }
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppStack />
      ) : (
        <LoginStack />
      )}
    </NavigationContainer>
  );
}
