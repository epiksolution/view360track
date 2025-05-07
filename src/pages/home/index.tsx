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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
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
    backgroundColor: "#f4f7f6", // A very subtle, clean background
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
    fontSize: 18,
    fontWeight: "bold", // Semi-bold
    marginBottom: 8,
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
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  statusColumn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 1, // Thin border
    borderColor: "#e9ecef", // Light grey border
    padding: 20, // Slightly less padding than main section
    alignItems: "flex-start", // Left align content
    justifyContent: "space-between",
    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  statusIcon: {
    width: 36, // Slightly smaller icons for a refined look
    height: 36,
    marginBottom: 15, // Space below icon
    resizeMode: "contain",
  },
  statusTitle: {
    fontSize: 18, // Slightly smaller title in column
    fontWeight: "600",
    marginBottom: 6,
    color: "#343a40",
    textAlign: "left",
  },
  statusDescription: {
    fontSize: 14, // Smaller descriptive text
    color: "#6c757d",
    marginBottom: 20, // Space before button
    textAlign: "left",
    lineHeight: 18, // Line height for description
  },
  roundedButtonWrapper: {
    width: "100%",
    marginTop: "auto", // Push button to bottom within the column
    overflow: "hidden", // Clip content to the border radius
    borderRadius: 8, // Apply border radius here
    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  // --- Styles for the bottom bar using vector icons ---
  bottomBar: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-around", // Distribute space evenly
    alignItems: "center", // Vertically align items
    height: 80, // Fixed height for the bottom bar
    backgroundColor: "#ffffff", // White background
    borderTopWidth: 1, // Add a subtle top border
    borderColor: "#e9ecef", // Light grey border color
    paddingHorizontal: 8, // Add some horizontal padding
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

      saveLocationData({
        user_id: userId,
        user_name: userName,
        lat: coords.latitude,
        lng: coords.longitude,
        createdOn: createdOn,
      });
    } else {
      console.warn("⚠️ No location data received in background task");
    }
  });

  const saveLocationData = async (dataSet: {
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
          fieldTypes: [
            {
              Field: "id",
              Type: "int",
              Null: "NO",
              Key: "PRI",
              Default: null,
              Extra: "auto_increment",
              value: null,
            },
            {
              Field: "user_id",
              Type: "varchar(255)",
              Null: "YES",
              Key: "",
              Default: null,
              Extra: "",
              value: "2",
            },
            {
              Field: "user_name",
              Type: "varchar(255)",
              Null: "YES",
              Key: "",
              Default: null,
              Extra: "",
              value: "3",
            },
            {
              Field: "lat",
              Type: "varchar(255)",
              Null: "YES",
              Key: "",
              Default: null,
              Extra: "",
              value: "4",
            },
            {
              Field: "lng",
              Type: "varchar(255)",
              Null: "YES",
              Key: "",
              Default: null,
              Extra: "",
              value: "5",
            },
            {
              Default: null,
              Extra: "",
              Field: "createdOn",
              Key: "",
              Null: "YES",
              Type: "varchar(255)",
              value: "wq",
            },
          ],
          tableData: {
            user_id: dataSet.user_id,
            user_name: dataSet.user_name,
            lat: dataSet.lat,
            lng: dataSet.lng,
            createdOn: dataSet.createdOn,
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

    if (!enabled) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable GPS/location services."
      );
    }

    if (fg.status !== "granted" || bg.status !== "granted") {
      Alert.alert("Permissions Error", "Location permissions are not granted.");
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

        saveLocationData({
          user_id: userId,
          user_name: userName,
          lat: coords.latitude,
          lng: coords.longitude,
          createdOn: createdOn,
        });
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

  const about = async () => {
    navigation.navigate("About");
  };

  const profile = async () => {
    navigation.navigate("Profile");
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={{ flex: 1 }}
      >

        {/* Current Location Section */}
        <Text style={styles.title}>Current Location</Text>
        <View style={styles.section}>
          <FontAwesome6 name="location-crosshairs" size={24} color="#0078b4" />
          <View style={styles.plainSection}>
            
            {location ? (
              <Text style={styles.locationText}>
                <Text>Latitude:  {location?.latitude.toFixed(6)},  </Text>
                 
                <Text> 
                  Longitude:  {location?.longitude.toFixed(6)}
                </Text> 
              </Text>
            ) : (
              <Text style={styles.locationText}>
                No recent location data available. Start tracking to see data.
              </Text>
            )}
          </View>
        </View>

        {/* Tracking Management Section Title */}
        <Text style={styles.sectionTitle}>Manage Tracking</Text>

        {/* Tracking Status Columns */}
        <View style={styles.statusContainer}>
          {/* Background Tracking Column */}
          <View style={styles.statusColumn}>
            {/* Assuming this icon is still a local asset */}
            <Image
              style={styles.statusIcon}
              source={require("../../../assets/tracking/background.png")}
            />
            <Text style={styles.statusTitle}>Background Tracking</Text>
            <Text style={styles.statusDescription}>
              Continues tracking even when the app is closed.
            </Text>
            <View style={styles.roundedButtonWrapper}>
              {backgroundStatus === "Inactive" ? (
                <Button
                  title="Start"
                  color="#0078b4" // Green
                  onPress={startForegroundTracking}
                />
              ) : (
                <Button
                  title="Stop"
                  color="#6c757d" // Muted Grey
                  onPress={stopBackgroundTracking}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* End of ScrollView */}
      {/* Fixed Bottom Tab Bar Container */}
      <View style={styles.bottomBar}>
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
          {/* Apply red color specifically to the Logout label */}
          <AntDesign name="logout" size={18} color="red" />
          <Text style={[styles.tabLabel, styles.logoutTabLabel]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
