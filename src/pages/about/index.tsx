import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { NavigationProp } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Clean white background
  },
  headerContainer: {
    backgroundColor: "#f8f9fa", // Very light header background
    paddingBottom: 0, 
    marginBottom: 30, // Increased space below header container
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30, // Consistent padding inside header
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Space below logo
  },
  logo: {
    width: 75, // Adjusted logo size for better visibility
    height: 75, // Adjusted logo size for better visibility,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 26, // Slightly refined title size
    fontWeight: "700",
    color: "#212529",
    textAlign: 'center',
    letterSpacing: 0.5, // Adjusted letter spacing
    marginBottom: 6, // Reduced space below title
    marginTop: 10,
  },
  tagline: {
    fontSize: 15, // Slightly smaller tagline
    color: "#6c757d",
    textAlign: 'center',
    lineHeight: 20, // Adjusted line height
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 20, // Consistent padding
    marginBottom: 20, // Consistent space between sections
    borderRadius: 4,
    marginHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 17, // Slightly smaller, focused title size
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 10, // Adjusted space below title
    paddingBottom: 8, // Add padding below title for visual separation from text
    borderBottomWidth: StyleSheet.hairlineWidth, // Subtle line below title
    borderColor: "#e9ecef", // Light line color
  },
  sectionText: {
    fontSize: 15,
    color: "#495057",
    lineHeight: 22, // Adjusted line height for standard text
    marginTop: 8, // Space above body text after the title/line
  },
   linkText: {
    fontSize: 15, // Match section text size
    color: '#007bff',
    textDecorationLine: 'underline',
    marginTop: 4, // Reduced top margin for links
    lineHeight: 20, // Adjusted line height for links
   },
    detailText: {
      fontSize: 15,
      color: "#495057",
      lineHeight: 22,
      marginBottom: 4, // Space below each detail line
    },
    detailLinkContainer: { // Container for detail text and links
        marginTop: 8, // Space above the details block
    },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#f8f9fa", // Match header background
  },
  versionText: {
    fontSize: 13,
    color: "#adb5bd",
  },
});

function AboutScreen({ navigation }: { navigation?: NavigationProp<any> }) {
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

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.container.backgroundColor }} edges={['bottom', 'left', 'right']}>
       <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />

       <ScrollView style={styles.container}>

         {/* Header Area */}
         <View style={styles.headerContainer}>
           <View style={styles.header}>
             <View style={styles.logoContainer}>
               <Image
                 source={require("../../../assets/logo-sm.png")} // Replace with your logo path
                 style={styles.logo}
               />
             </View>
             <Text style={styles.appTitle}>View360 GPS Tracker</Text>
             <Text style={styles.tagline}>Track location.</Text>
           </View>
         </View>

         {/* Sections */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>About this Application</Text>
           <Text style={styles.sectionText}>
             This application is designed for real-time GPS tracking, allowing
             you to monitor and record location data. It utilizes your device's
             GPS capabilities to provide accurate position information. The
             recorded data can be used for various purposes such as tracking
             routes, or monitoring assets.
           </Text>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Application Details</Text>
            {/* Wrap detail text and links in a container for spacing */}
            <View style={styles.detailLinkContainer}>
                <Text style={styles.detailText}>Developed by: View360</Text>
                <Text style={styles.detailText}>
                 Contact: <Text style={styles.linkText} onPress={() => handleLinkPress('mailto:support@example.com')}>contact@epikso.com</Text>
                </Text>
                {/* Add more detail lines using detailText style */}
            </View>
         </View> 


       </ScrollView>

       {/* Footer */}
       <View style={styles.footer}>
          <Text style={styles.versionText}>Version: {appVersion}</Text>
       </View>

     </SafeAreaView>
  );
}

export default AboutScreen;