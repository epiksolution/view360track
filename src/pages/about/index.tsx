import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";

// Placeholder data
const jobData = {
  companyLogo: require("../../../assets/logo-sm.png"),
  companyName: "View360 GPS Tracking",
  location: "GPS Tracking",
  descriptions: [
    {
      feature: "Real-time GPS Tracking",
      description: "Monitor live device location.",
    },
    {
      feature: "Background Tracking",
      description: "Track location even when app is closed.",
    },
    {
      feature: "Location Data Recording",
      description: "Save and view past locations.",
    },
    {
      feature: "Route Tracking",
      description: "Visualize movement paths.",
    },
    {
      feature: "Asset Monitoring",
      description: "Track assets like vehicles or equipment.",
    },
  ],
};

function AboutScreen() {
  const [appVersion, setAppVersion] = useState("1.0.0");

  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const version = await SecureStore.getItemAsync("appVersion");
        setAppVersion(version || "1.0.0");
      } catch (error) {
        console.error("Failed to fetch app version:", error);
        setAppVersion("N/A");
      }
    };
    fetchAppVersion();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={["#e3f2fd", "#fcfcfc"]}
          style={styles.headerGradient}
        />
        <View style={styles.logoContainer}>
          <Image source={jobData.companyLogo} style={styles.companyLogo} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{jobData.companyName}</Text>
          <Text style={styles.location}>{jobData.location}</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.qualificationsList}>
              {jobData.descriptions.map((desc, index) => (
                <View key={index} style={styles.qualificationItem}>
                  <Text>- </Text>
                  <Text>
                    <Text style={{ fontWeight: "600" }}>{desc.feature}</Text> -{" "}
                    {desc.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* App Version Section */}
          <View style={styles.footerCard}>
            <View style={styles.versionHeader}>
              <Text style={styles.versionLabel}>App Version</Text>
              <Text style={styles.versionNumber}>v{appVersion}</Text>
            </View>
            <Text style={styles.versionDescription}>
            You're using version 1.0.0, which includes new features and improvements. Stay updated for the best experience!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerGradient: {
    height: 120,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    alignSelf: "flex-start",
    marginHorizontal: 20,
  },
  companyLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#333",
    marginBottom: 10,
  },
  qualificationsList: {
    marginTop: 5,
    paddingLeft: 5,
  },
  qualificationItem: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  footerCard: {
    // backgroundColor: "#fff", // Keeping it simple with white
    backgroundColor: "#f9f9f9", // Light background for the header
    borderRadius: 12, // Rounded corners for a modern touch
    paddingVertical: 15, // Comfortable vertical padding
    paddingHorizontal: 20, // Consistent horizontal padding 
    marginTop: 20, // Space above the footer card
  },
  versionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1, // Bottom border for separation
    borderColor: "#e0e0e0", // Light gray for the border
    paddingBottom: 10, // Padding to separate header from content
  },
  versionLabel: {
    fontSize: 16, // Clear and readable font size
    fontWeight: "500", // Medium weight for the label
    color: "#333", // Dark gray color for the label
  },
  versionNumber: {
    fontSize: 16, // Same font size as label for consistency
    fontWeight: "600", // Slightly bolder font weight to emphasize the version number
    color: "#007bff", // Blue color for emphasis
    paddingVertical: 5, // Slight padding to make it more tactile
    paddingHorizontal: 15, // Balanced padding to make the version number stand out
    backgroundColor: "#e3f2fd", // Light blue background for the version number
    borderRadius: 20, // Rounded pill shape
  },
  versionDescription: {
    fontSize: 14, // Smaller size for the description text
    color: "#555", // Medium gray to keep it readable yet subtle
    lineHeight: 20, // Proper line height for readability
    textAlign: "center", // Center aligned for symmetry
    marginTop: 10, // Space above the description text
  },
});

export default AboutScreen;
