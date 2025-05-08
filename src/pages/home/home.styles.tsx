import { StyleSheet } from "react-native";

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

export default styles;
