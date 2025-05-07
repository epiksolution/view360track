import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";
import { Image } from "react-native";

import LoginScreen from "../pages/login/index";
import HomeScreen from "../pages/home/index";
import AboutScreen from "../pages/about";
import ProfileScreen from "../pages/profile";

const Stack = createStackNavigator();

export default function NavigationRoute() {
  const [userName, setUserName] = useState("");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={(props: any) => (
            <HomeScreen {...props} setUserName={setUserName} />
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
    </NavigationContainer>
  );
}
