import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  USER_ID,
  USER_NAME,
} from "../../constants/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: -20,
    backgroundColor: "#e7f0ff",
    paddingTop: 100,
    paddingBottom: 60,
    width: "100%",
  },
  textContainer: {
    paddingVertical: 60,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    marginTop: -20, 
    shadowRadius: 3.84,
    flexGrow: 1,
    elevation: 5,
  },

  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

function LoginScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [username, setUsername] = useState("admin@mailinator.com");
  const [password, setPassword] = useState("aFF(p+m)4DA^");

  useEffect(() => {
    checkAuthToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkAuthToken();

      return () => {
        setUsername("");
        setPassword("");
      };
    }, [])
  );

  const checkAuthToken = async () => {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (authToken) {
      navigation.navigate("Home");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Skip2FA: false,
          email: username,
          password: password,
          token: "",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        let user_name = "";
        let user_id = "";
        if (data?.data?.user?.firstname) {
          user_name = data.data.user.firstname;
          if (data?.data?.user?.lastname) {
            user_name += ` ${data.data.user.lastname}`;
          }
        }
        if (data?.data?.user?.id) {
          user_id = data.data.user.id;
        }
        const setCookieHeader = response.headers.get("Set-Cookie");
        if (setCookieHeader) {
          await SecureStore.setItemAsync(USER_ID, user_id);
          await SecureStore.setItemAsync(USER_NAME, user_name);
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, setCookieHeader);
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, setCookieHeader);
          navigation.navigate("Home");
        }
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Add App Title */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo.png")} // Replace with your logo path
          style={styles.logo}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Log In</Text>
        {/* Username Input */} 
        <Text style={{marginBottom:5}}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        {/* Password Input */}

        <Text style={{marginBottom:5}}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen;
