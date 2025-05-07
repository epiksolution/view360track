import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

// Placeholder data for the job details
const jobData = {
  companyLogo: require("../../../assets/logo-sm.png"), // Replace with your actual logo path
  companyName: "View360 GPS Tracking",
  location: "GPS Tracking",

  descriptions: [
    {
      feature: "Real-time GPS Tracking",
      description: "Allows continuous monitoring of current location.",
    },
    {
      feature: "Background Tracking",
      description:
        "Continues to record location data even when the app is not actively open.",
    },
    {
      feature: "Location Data Recording",
      description: "Stores historical position information.",
    },
    {
      feature: "Utilizes Device GPS",
      description:
        "Leverages the device's built-in GPS for accurate positioning.",
    },
    {
      feature: "Route Tracking",
      description: "Records and displays the path taken.",
    },
    {
      feature: "Asset Monitoring",
      description:
        "Enables keeping track of the location of valuable items or vehicles.",
    },
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light background color
    paddingTop: 0, // Space for the status bar
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30, // Rounded top-left corner
    borderTopRightRadius: 30, // Rounded top-right corner
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
    backgroundColor: "#ffffff", // White background for the logo container
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start", // Center the logo horizontally
    marginTop: -50, // Overlap the content container
    marginHorizontal: 20, // Center the logo horizontally
  },
  companyLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10, // Space after logo area
    marginBottom: 4,
    textAlign: "center",
  },
  location: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  companyDescription: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  starIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 24,
    color: "#ffc107", // Example star color
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#333",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  qualificationsList: {
    marginTop: 5,
  },
  qualificationItem: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
  applyButtonContainer: {
    padding: 20,
    backgroundColor: "#ffffff", // White background behind the button
    borderTopWidth: 1,
    borderColor: "#eee", // Subtle line above the button
  },
  applyButton: {
    backgroundColor: "#6a11cb", // Purple color from the image
    paddingVertical: 15,
    borderRadius: 8, // Rounded button corners
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // White text
  },
  footer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  versionText: {
    fontSize: 16,
    color: "#333",
  },
  versionDetails: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
});

function AboutScreen() {
  const [appVersion, setAppVersion] = useState<string>("");

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
    <View style={styles.container}>
      <LinearGradient
        colors={["#e3f2fd", "#fcfcfc"]}
        style={{ position: "relative" }}
      >
        <View style={{ height: 100 }}></View>
      </LinearGradient>
      <View style={styles.logoContainer}>
        <Image source={jobData.companyLogo} style={styles.companyLogo} />
      </View>
      <View style={styles.contentContainer}>
        {/* Header Content */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{jobData.companyName}</Text>
          <Text style={styles.location}>{jobData.location}</Text>
        </View>

        {/* Scrollable Job Details */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.qualificationsList}>
              {jobData.descriptions.map((desc, index) => (
                <Text key={index} style={styles.qualificationItem}>
                  <Text style={{ fontWeight: 600 }}>- {desc.feature}</Text> - {" "}
                   {desc.description}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer with version info */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version: {appVersion}</Text>
        <Text style={styles.versionDetails}>
          You're using version {appVersion}, which includes new features and
          improvements. Stay updated for the best experience!
        </Text>
      </View>
    </View>
  );
}

export default AboutScreen;
