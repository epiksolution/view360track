import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  Platform,
  Linking,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView as SafeBottomAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  USER_ID,
  USER_NAME,
} from "../../constants/constants";
import { AntDesign, Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";

const LOCATION_TASK_NAME = "background-location-task";

type LocationCoords = {
  latitude: number;
  longitude: number;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2", // A very subtle, clean background
  },
  scrollViewContent: {
    paddingVertical: 16, // Vertical padding
    paddingHorizontal: 16, // Horizontal padding
    paddingBottom: 80, // Adjust based on your bottomBar height + any extra space
  },
  section: {
    backgroundColor: "#ffffff", // Crisp white for sections
    borderRadius: 15, // Gentle rounding
    borderWidth: 1,
    borderColor: "#e9ecef", // A very light grey border
    padding: 20,
    marginBottom: 16, // Consistent space between sections
    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  plainSection: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600", // Semi-bold
    marginBottom: 10,
    marginHorizontal: 10,
    color: "#080808", // Dark grey for text
  },
  locationText: {
    fontSize: 15,
    color: "#6c757d",
    lineHeight: 22, // Improved readability with line height
  },
  locationCoords: {
    fontWeight: "bold",
    color: "#007bff", // Accent color (standard blue)
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#212529",
  },
  statusContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  statusColumn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 0, // Thin border
    borderColor: "#e9ecef", // Light grey border
    padding: 20, // Slightly less padding than main section
    // alignItems: "flex-start", // Removed to allow flexible internal layout
    justifyContent: "space-between", // Keep space-between to push content apart
    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  statusIcon: {
    marginRight: 10, // Add margin to the right of the icon
  },
  statusTitle: {
    fontSize: 20, // Slightly smaller title in column
    fontWeight: "400",
    // marginBottom: 6, // Removed default margin bottom
    color: "#343a40",
    // textAlign: "left", // Removed as row handles alignment
  },
  statusDescription: {
    fontSize: 13, // Smaller descriptive text
    color: "#6c757d",
    // marginBottom: 20, // Removed default margin bottom
    textAlign: "left",
    lineHeight: 18, // Line height for description
    marginBottom: 15, // Add margin below the description text
  },
  // New style for the container holding the button(s) inside the status column
  statusButtonContainer: {
    width: "100%", // Take full width to control alignment
    alignItems: "flex-end", // Align items (buttons) to the right
    // marginTop: 'auto', // Push this container to the bottom of the statusColumn - sometimes needed, test layout
  },
  // --- Updated permissionDeniedBox styles ---
  // --- Updated permissionDeniedBox styles ---
  permissionDeniedBox: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: "column", // Keep column layout for title, text, and button
    alignItems: "flex-start",
  },
  permissionDeniedTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Space below the title container
  },
  permissionDeniedIcon: {
    marginRight: 8, // Space between icon and title text
  },
  permissionDeniedTitle: {
    fontSize: 20, // Slightly larger title font size
    fontWeight: "400", // Medium weight for emphasis
  },
  permissionDeniedText: {
    fontSize: 14, // Slightly smaller text font size for body
    color: "#766464", // Dark red text color
    marginBottom: 15, // Space before the button
    lineHeight: 20, // Improve readability
  },
  settingsButton: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15, // Horizontal padding for button
    // Style for the button itself (if you were using TouchableOpacity and Text)
    // Since you're using React Native's Button, you control color via the 'color' prop
  },
  settingsButtonContainer: {
    display: "flex",
    flexDirection: "row", // Align button and text in a row
    justifyContent: "flex-end", // Center the button
    width: "100%", // Full width for the button container
  },

  // --- Styles for the bottom bar using vector icons ---
  bottomBar: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-around", // Distribute space evenly
    alignItems: "center", // Vertically align items
    // height: 80, // Fixed height for the bottom bar
    backgroundColor: "#ffffff", // White background
    borderTopWidth: 1, // Add a subtle top border
    borderColor: "#e9ecef", // Light grey border color
    paddingHorizontal: 8, // Add some horizontal padding
    paddingVertical: 8, // Add some vertical padding
    elevation: 0,
    shadowOpacity: 0,
  },
  bottomTab: {
    // Style for each individual tab (TouchableOpacity wrapper)
    flex: 1, // Make each tab take equal space
    alignItems: "center", // Center icon/text horizontally
    justifyContent: "center", // Center icon/text vertically
    paddingVertical: 4, // Reduced padding slightly
  },
  tabLabel: {
    // Style for the text labels
    fontSize: 14, // Small font size for labels
    color: "#6c757d", // Default text color (muted grey)
    fontWeight: "500", // Medium font weight
    marginTop: 4, // Space between icon and text
  },
  logoutTabLabel: {
    // Specific style for the logout label color
    color: "#dc3545", // Red color for logout text
  },
  // --- End of bottom bar styles ---
});

function HomeScreen({
  navigation,
  setUserName,
}: {
  navigation: NavigationProp<any>;
  setUserName: (name: string) => void;
}) {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [userId, setUserId] = useState("");
  const [userName, setLocalUserName] = useState("");
  const [foregroundSub, setForegroundSub] =
    useState<Location.LocationSubscription | null>(null);
  const [locationStatus, setLocationStatus] = useState("Inactive");
  const [foregroundStatus, setForegroundStatus] = useState("Inactive");
  const [backgroundStatus, setBackgroundStatus] = useState("Inactive");

  useEffect(() => {
    checkAuthToken();
    checkPermissionsAndServices();
  }, []);

  useEffect(() => {
    const backAction = () => {
      // Disable back button functionality
      if (
        navigation.getState().routes[navigation.getState().index].name ===
        "Home"
      ) {
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]); // Add navigation as a dependency

  useFocusEffect(
    React.useCallback(() => {
      checkAuthToken();

      return () => {
        setUserId("");
        setLocalUserName("");
      };
    }, [])
  );

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    console.log("📡 Background task triggered");

    if (error) {
      console.error("❌ TaskManager Error:", error);
      return;
    }

    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (location) {
      let createdOn = new Date().toISOString();
      if (location?.timestamp) {
        createdOn = new Date(location.timestamp).toISOString();
      }
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log("📍 Received background location:", coords);

      if (userId && userName) {
        saveLocationData({
          tracking_type: "background",
          user_id: userId,
          user_name: userName,
          lat: coords.latitude,
          lng: coords.longitude,
          createdOn: createdOn,
        });
      }
    } else {
      console.warn("⚠️ No location data received in background task");
    }
  });

  const saveLocationData = async (dataSet: {
    tracking_type: string;
    user_id: string;
    user_name: string;
    lat: number;
    lng: number;
    createdOn: string;
  }) => {
    try {
      await fetch(`${BASE_URL}database/addTableRow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: "location_history",
          tableData: {
            tracking_type: dataSet.tracking_type,
            user_id: dataSet.user_id,
            user_name: dataSet.user_name,
            lat: dataSet.lat,
            lng: dataSet.lng,
            createdOn: dataSet.createdOn,
            mobile_brand: Device.brand,
            mobile_model: Device.modelName,
            mobile_os_name: Device.osName,
            mobile_os_version: Device.osVersion,
            mobile_os_internal_buildid: Device.osInternalBuildId,
          },
        }),
      });
      console.log("✅ location sent");
    } catch (err) {
      console.error("❌ send error:", err);
    }
  };

  const checkPermissionsAndServices = async () => {
    const fg = await Location.requestForegroundPermissionsAsync();
    const bg = await Location.requestBackgroundPermissionsAsync();

    console.log("🛂 Foreground permission:", fg.status);
    console.log("🛂 Background permission:", bg.status);

    const enabled = await Location.hasServicesEnabledAsync();
    console.log("📶 Location services enabled:", enabled);

    if (enabled) {
      setLocationStatus("Active");
    }
    //  else {
    //   Alert.alert(
    //     "Location Services Disabled",
    //     "Please enable GPS/location services."
    //   );
    // }

    // if (fg.status !== "granted" || bg.status !== "granted") {
    //   Alert.alert("Permissions Error", "Location permissions are not granted.");
    // }

    if (fg.status === "granted" && enabled) {
      console.log("✅ Foreground permissions granted");
      startForegroundTracking();
    }
    if (bg.status === "granted" && enabled) {
      console.log("✅ Background Permissions granted");
      startBackgroundTracking();
    }
  };

  const checkAuthToken = async () => {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (authToken) {
      const userId = await SecureStore.getItemAsync(USER_ID);
      if (userId) {
        setUserId(userId);
      }
      const userName = await SecureStore.getItemAsync(USER_NAME);
      if (userName) {
        setLocalUserName(userName);
        setUserName(userName);
      }
    } else {
      navigation.navigate("Login");
    }
  };

  const startForegroundTracking = async () => {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000,
        distanceInterval: 0,
      },
      async (loc) => {
        let createdOn = new Date().toISOString();
        if (loc?.timestamp) {
          createdOn = new Date(loc.timestamp).toISOString();
        }
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(coords);

        if (userId && userName) {
          saveLocationData({
            tracking_type: "foreground",
            user_id: userId,
            user_name: userName,
            lat: coords.latitude,
            lng: coords.longitude,
            createdOn: createdOn,
          });
        }
      }
    );

    setForegroundSub(sub);
    setForegroundStatus("Active");
    console.log("🚀 Foreground tracking started");
  };

  const stopForegroundTracking = () => {
    foregroundSub?.remove();
    setForegroundSub(null);
    setLocation(null);
    setForegroundStatus("Inactive");
    console.log("⛔️ Foreground tracking stopped");
  };

  const startBackgroundTracking = async () => {
    const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    console.log("🔍 Background tracking already started:", alreadyStarted);

    if (!alreadyStarted) {
      try {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000,
          distanceInterval: 0,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Tracking location",
            notificationBody: "App is tracking your location in background.",
          },
        });

        const confirmed = await Location.hasStartedLocationUpdatesAsync(
          LOCATION_TASK_NAME
        );
        setBackgroundStatus("Active");
        console.log("📌 Confirmed tracking started:", confirmed);
      } catch (err) {
        console.error("❌ Failed to start background tracking:", err);
        Alert.alert("Error", "Could not start background tracking.");
      }
    } else {
      console.log("✅ Background tracking already active");
    }
  };

  const stopBackgroundTracking = async () => {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setBackgroundStatus("Inactive");
      console.log("⛔️ Background tracking stopped");
    } else {
      console.log("ℹ️ Background tracking was not active");
    }
  };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const about = async () => {
    navigation.navigate("About");
  };

  const profile = async () => {
    navigation.navigate("Profile");
  };
  const logout = async () => {
    setUserId("");
    setLocalUserName("");
    setUserName("");
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={{ flex: 1 }}
      >
        {/* {needsBasicLocationSetup && ( */}
        <Text style={styles.title}>Take action</Text>
        {locationStatus !== "Active" && (
          <View
            style={[styles.permissionDeniedBox, { backgroundColor: "#fce8e7" }]}
          >
            <View style={styles.permissionDeniedTitleContainer}>
              <AntDesign
                name="warning"
                size={20}
                color="#c84a48"
                style={styles.permissionDeniedIcon}
              />
              <Text
                style={[styles.permissionDeniedTitle, { color: "#c84a48" }]}
              >
                Location Services Required
              </Text>
            </View>
            <Text style={styles.permissionDeniedText}>
              Location access is essential for enabling GPS tracking. Please
              turn on device location and grant the necessary permissions in
              your device settings.
            </Text>
            <View style={styles.settingsButtonContainer}>
              <TouchableOpacity
                style={[styles.settingsButton, { backgroundColor: "#c84a48" }]}
                onPress={openSettings}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Go to Settings
                </Text>
              </TouchableOpacity>
              {/* Button color matching the box theme */}
            </View>
          </View>
        )}

        {locationStatus === "Active" &&
          (foregroundStatus !== "Active" || backgroundStatus !== "Active") && (
            <View
              style={[
                styles.permissionDeniedBox,
                { backgroundColor: "#fdefcf" },
              ]}
            >
              <View style={styles.permissionDeniedTitleContainer}>
                {/* Using a location pin icon */}

                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#f7a900"
                  style={styles.permissionDeniedIcon}
                />
                <Text
                  style={[styles.permissionDeniedTitle, { color: "#f7a900" }]}
                >
                  Enable Background Tracking
                </Text>
              </View>
              <Text style={styles.permissionDeniedText}>
                For reliable tracking when the app is closed, please change the
                location permission to "Allow all the time" in your device
                settings.
              </Text>

              <View style={styles.settingsButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.settingsButton,
                    { backgroundColor: "#f7a900" },
                  ]}
                  onPress={openSettings}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Go to Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {/* Tracking Management Section Title */}
        <Text style={styles.title}> Tracking status</Text>

        {/* Tracking Status Columns */}
        <View style={styles.statusContainer}>
          {/* Background Tracking Column */}
          <View
            style={[
              styles.statusColumn,
              {
                borderColor:
                  backgroundStatus === "Active" ? "#a9dcb5" : "#f1aeb5", // Light green or light red
                borderWidth: 1, // Ensure border is visible
              },
            ]}
          >
            {/* Status Icon (absolute) */}
            <View style={{ position: "absolute", top: 10, right: 10 }}>
              {backgroundStatus === "Active" ? (
                <AntDesign name="checkcircle" size={20} color="green" />
              ) : (
                <AntDesign name="closecircle" size={20} color="red" />
              )}
            </View>

            {/* Icon and Title Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {/* Assuming this icon is still a local asset */}

              <Entypo
                name="location"
                style={styles.statusIcon}
                size={20}
                color="#0078b4"
              />
              <Text style={styles.statusTitle}>Background Tracking</Text>
            </View>

            {/* Description - Changed Text Here */}
            <Text style={styles.statusDescription}>
              {backgroundStatus === "Active"
                ? "Location tracking is currently enabled in the background."
                : "Location tracking is currently disabled in the background."}
            </Text>

            {/* Button Container (right-aligned) */}
            <View style={styles.statusButtonContainer}>
              {backgroundStatus === "Inactive" && (
                <TouchableOpacity
                  style={[
                    styles.settingsButton,
                    { backgroundColor: "#0078b4" }, // Blue/Accent color
                  ]}
                  onPress={checkPermissionsAndServices}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Start Tracking
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* End of ScrollView */}
      {/* Fixed Bottom Tab Bar Container */}
      <SafeBottomAreaView edges={["bottom"]} style={styles.bottomBar}>
        {/* About Tab */}
        <TouchableOpacity style={styles.bottomTab} onPress={about}>
          <Entypo name="list" size={18} />
          <Text style={styles.tabLabel}>About</Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity style={styles.bottomTab} onPress={profile}>
          <FontAwesome6 name="user" size={18} />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>

        {/* Logout Tab */}
        <TouchableOpacity style={styles.bottomTab} onPress={logout}>
          <AntDesign name="logout" size={18} color="red" />
          <Text style={[styles.tabLabel, styles.logoutTabLabel]}>Logout</Text>
        </TouchableOpacity>
      </SafeBottomAreaView>
    </SafeAreaView>
  );
}

export default HomeScreen;
