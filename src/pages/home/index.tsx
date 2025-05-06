import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, Button } from "react-native";
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

const LOCATION_TASK_NAME = "background-location-task";

type LocationCoords = {
  latitude: number;
  longitude: number;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "80%",
  },
  statusColumn: {
    alignItems: "center",
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    color: "green", // Change to red if inactive
  },
});

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [foregroundSub, setForegroundSub] =
    useState<Location.LocationSubscription | null>(null);
  const [foregroundStatus, setForegroundStatus] = useState("Inactive");
  const [backgroundStatus, setBackgroundStatus] = useState("Inactive");

  useEffect(() => {
    checkAuthToken();
    checkPermissionsAndServices();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkAuthToken();

      return () => {
        setUserId("");
        setUserName("");
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
          // deferredUpdatesInterval: 60000,
          // deferredUpdatesDistance: 100,
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

  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusColumn}>
          <Text style={styles.statusTitle}>Foreground Tracking</Text>
          <Text style={styles.statusValue}>{foregroundStatus}</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.statusTitle}>Background Tracking</Text>
          <Text style={styles.statusValue}>{backgroundStatus}</Text>
        </View>
      </View>
      <Text style={styles.title}>📍 Expo Background Location Tracker</Text>
      {location && (
        <Text>
          Latitude: {location.latitude.toFixed(6)} | Longitude:{" "}
          {location.longitude.toFixed(6)}
        </Text>
      )}
      {/* Status Columns */}
      <View style={styles.buttonGroup}>
        <Button
          title="Start Foreground Tracking"
          onPress={startForegroundTracking}
        />
        <Button
          title="Stop Foreground Tracking"
          onPress={stopForegroundTracking}
        />
        <Button
          title="Start Background Tracking"
          onPress={startBackgroundTracking}
        />
        <Button
          title="Stop Background Tracking"
          onPress={stopBackgroundTracking}
        />
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

export default HomeScreen;
