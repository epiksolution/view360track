import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";

import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  USER_ID,
  USER_NAME,
} from "../../constants/constants";
import { AuthContext } from '../../context/AuthContext';

function LoginScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, setUserName } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apphit: "view360",
          deviceid: Device.osInternalBuildId || "",
        },
        body: JSON.stringify({
          deviceId: Device.osInternalBuildId || "",
          appType: "mobile",
          type: Device.osName,
          Skip2FA: false,
          email: username,
          password,
          token: "",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const user = data?.data?.user || {};
        const user_name = `${user.firstname || ""} ${
          user.lastname || ""
        }`.trim();
        const user_id = user.id || "";
        const setCookieHeader = response.headers.get("Set-Cookie");

        if (setCookieHeader) {
          await SecureStore.setItemAsync(USER_ID, user_id);
          await SecureStore.setItemAsync(USER_NAME, user_name);
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, setCookieHeader);
          setUserName(user_name);
          login();
        }
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#e3f2fd", "#f0e2f3"]} style={styles.container}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.inner}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
      >
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>
        Please enter the details below to continue.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={20}
          color="#aaa"
          />
        </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: Platform.OS === "ios" ? 0 : 20 }}>
        <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
        >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: "#444",
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: "#0078b4",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LoginScreen;
