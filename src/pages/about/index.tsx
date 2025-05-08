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
              <Text style={styles.versionLabel}>App Version</Text>
              <Text style={styles.versionNumber}>v{appVersion}</Text>
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
    // backgroundColor: "#f9f9f9", // Light background for the footer card
    borderRadius: 15, // Rounded corners for a modern touch
    paddingVertical: 15, // Comfortable vertical padding
    paddingHorizontal: 20, // Consistent horizontal padding 
    marginTop: 20, // Space above the footer card
    borderWidth: 1, // Border for definition
    borderColor: "#eee", // Light gray border color  
  }, 
  versionLabel: {
    fontSize: 16, // Clear and readable font size
    fontWeight: "500", // Medium weight for the label
    color: "#333", // Dark gray color for the label
  }, 
  versionNumber: {
    fontSize: 16, // Slightly larger font size for the version number
    fontWeight: "700", // Bold weight for emphasis 
    marginTop: 6, // Space between label and version number
  },
  
});

export default AboutScreen;
