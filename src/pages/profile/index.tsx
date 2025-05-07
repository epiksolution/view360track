import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AUTH_TOKEN_KEY, BASE_URL, USER_ID } from "../../constants/constants";
import { Feather } from "@expo/vector-icons"; // ✅ Expo Feather icons

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  headerContainer: {
    marginBottom: 16,
    marginTop:20,
  },
  header: { 
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical:15
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 0,
    borderColor: "#0078b4",
    backgroundColor: "#c2deec",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center", 
  },
  userBio: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d5db",
  },
  detailRow: {
    marginBottom: 16,
  },
  detailIconLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    width: 20,
    height: 20,
    color: "#4b5563", 
    marginBottom: -5,
  },

  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4b5563",
    marginLeft: 10,
  },
  detailValue: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 28,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 20,
  },
});

function ProfileScreen({ navigation }: { navigation?: NavigationProp<any> }) {
  interface UserData {
    username?: string;
    address?: string;
    email?: string;
    phone?: string;
    location?: string;
    name?: string;
    jobTitle?: string;
    role?: string;
    createdOn?: string;
    profileImage?: string;
    company?: string;
    website?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  }

  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAuthToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkAuthToken();
    }, [])
  );

  const checkAuthToken = async () => {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (authToken) {
      const userId = await SecureStore.getItemAsync(USER_ID);
      if (userId) {
        setUserId(userId);
        fetchProfileData(userId);
      }
    } else if (navigation) {
      navigation.navigate("Login");
    }
  };

  const fetchProfileData = async (userid: string) => {
    try {
      const response = await fetch(`${BASE_URL}user/${userid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status) {
        let name = data.data?.firstName || "";
        if (data.data?.lastName) name += ` ${data.data.lastName}`;
        
        setUserData({
          email: data.data?.email,
          username: data.data?.username,
          phone : data.data?.phone || "-",
          address: data.data?.address || "-",
          name,
          jobTitle: data.data?.jobTitle || "-",
          createdOn: data.data?.createdOn || "-",
          profileImage: data.data?.profileUrl,
          city: data.data?.city || "-",
          state: data.data?.state || "-",
          country: data.data?.country || "-",
          zipCode: data.data?.zipCode || "-",
          role: data.data?.role || "-",
        });
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to fetch profile data:", err);
      setError(err);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderDetailRow = (
    label: string,
    value: string | React.ReactNode,
    iconName: keyof typeof Feather.glyphMap
  ) => {
    const valueElement =
      typeof value === "string" ? (
        <Text style={styles.detailValue}>{value}</Text>
      ) : (
        value
      );

    return (
      <View style={styles.detailRow} key={label}>
        <View style={styles.detailIconLabel}>
          <Feather name={iconName} style={styles.detailIcon} size={18} color="#4b5563" />
          <Text style={styles.detailLabel}>{label}</Text>
        </View>
        {valueElement}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.container.backgroundColor}
      /> */}

      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              {userData?.profileImage ? (
                <Image
                  source={{ uri: userData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={{ fontSize: 44, color: "#0078b4" }}>
                  {userData?.name?.charAt(0).toUpperCase() || "N"}
                </Text>
              )}
            </View>
            <Text style={styles.userName}>{userData?.name || "NA"}</Text> 
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {userData && (
            <>
              {renderDetailRow("Username", userData.username, "user")}
              {renderDetailRow("Email", userData.email, "mail")}
              {renderDetailRow("Phone", userData.phone, "phone")}
              {renderDetailRow("Address", userData.address, "map-pin")}
              {renderDetailRow("City", userData.city, "map")}
              {renderDetailRow("State", userData.state, "flag")}
              {renderDetailRow("Country", userData.country, "globe")}
              {renderDetailRow("Zip Code", userData.zipCode, "hash")}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Details</Text>
          {userData && (
            <>
              {renderDetailRow("Job Title", userData.jobTitle, "briefcase")}
              {renderDetailRow("Role", userData.role, "award")}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
