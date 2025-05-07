import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  // Platform, // Uncomment if needed
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import { AUTH_TOKEN_KEY, BASE_URL, USER_ID } from "../../constants/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#f8f9fa",
    paddingBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#dee2e6",
    marginBottom: 30,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#e9ecef",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userBio: {
    fontSize: 15,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  joinDateText: {
    fontSize: 13,
    color: "#adb5bd",
    marginTop: 8,
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
    marginHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e9ecef",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e9ecef",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    flex: 1.2,
    marginRight: 15,
  },
  detailValue: {
    fontSize: 15,
    color: "#495057",
    flex: 2,
    textAlign: "right",
  },
  linkText: {
    fontSize: 15,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
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
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    checkAuthToken();
  }, []); // Empty dependency array to run once on mount

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
        fetchProfileData();
      }
    } else if (navigation) {
      navigation.navigate("Login");
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${BASE_URL}user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status) {
        let name = data.data?.firstName;
        if (data.data?.lastName) {
          name += ` ${data.data.lastName}`;
        } 
        let phone = "";
        if (
          data.data?.phone &&
          data.data?.phone !== "null" &&
          data.data?.phone != "0"
        ) {
          phone += data.data.phone;
        }
        setUserData({
          email: data.data?.email,
          username: data.data?.username,
          phone: data.data?.phone,
          address: data.data?.address,
          name: name,
          jobTitle: data.data?.jobTitle || "",
          createdOn: data.data?.createdOn || "",
          profileImage: data.data?.profileUrl, 
          city: data.data?.city || "",
          state: data.data?.state || "",
          country: data.data?.country || "",
          zipCode: data.data?.zipCode || "",
          role: data.data?.role || "",
        }); // Set user data
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

  // Helper function to render detail rows
  const renderDetailRow = (
    label: string,
    value: string | React.ReactNode,
    isLastRow: boolean = false
  ) => {
    // Check if userData is loaded before rendering rows
    if (!userData && !loading) return null; // Don't render rows if data failed to load

    const valueElement =
      typeof value === "string" ? (
        <Text style={styles.detailValue}>{value}</Text>
      ) : (
        value // Value is already a React Node (like a <Text> or <TouchableOpacity>)
      );

    return (
      <View
        style={[
          styles.detailRow,
          isLastRow ? { borderBottomWidth: 0, paddingBottom: 0 } : {},
        ]}
        key={label} // Added key prop
      >
        <Text style={styles.detailLabel}>{label}:</Text>
        {valueElement}
      </View>
    );
  };

  // Define handleLinkPress here
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  // --- Conditional Rendering ---
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
        {/* Optional: Display error message for debugging */}
        {/* <Text style={{ color: '#888', textAlign: 'center', marginTop: 5, marginHorizontal: 20 }}>{error.message}</Text> */}
      </SafeAreaView>
    );
  }

  // If data is loaded, render the profile
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.container.backgroundColor}
      />

      <ScrollView style={styles.container}>
        {/* Header Area - Use userData */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              {userData?.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
              />
              ) : (
              <View
                style={[
                styles.profileImageContainer,
                { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text style={{ fontSize: 40, color: "#6C757D" }}>
                {userData?.name?.charAt(0).toUpperCase() || "N"} 
                </Text>
              </View>
              )}
            </View>
            <Text style={styles.userName}>{userData?.name || "NA"}</Text>
            <Text style={styles.userBio}>{userData?.jobTitle || "-"}</Text>
            {/* <Text style={styles.joinDateText}>
              {userData?.createdOn || "Join date N/A"}
            </Text> */}
          </View>
        </View>

        {/* Contact Information Section - Use userData */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {userData && ( // Check if data exists before rendering rows
            <>
            {renderDetailRow("Username", userData.username || "N/A")}
              {renderDetailRow("Email", userData.email || "N/A")}
              {renderDetailRow("Phone", userData.phone || "N/A")}
              {renderDetailRow("Address", userData.address || "N/A")}
              {renderDetailRow("City", userData.city || "N/A")}
              {renderDetailRow("State", userData.state || "N/A")}
              {renderDetailRow("Country", userData.country || "N/A")}
              {renderDetailRow("Zip Code", userData.zipCode || "N/A")}

            </>
          )}
        </View>

        {/* Professional Details Section - Use userData */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Details</Text>
          <Text>
            {userData && ( // Check if data exists before rendering rows
              <>
                {renderDetailRow("Job Title", userData.jobTitle || "N/A")}
                {renderDetailRow("Role", userData.role || "N/A")}
              </>
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
