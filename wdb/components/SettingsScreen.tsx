import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AuthContext } from "../App";
import Button from "./Button";
import { ButtonStyles, CommonStyles } from "./Styles";

const SettingsScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Button
        label="Log Out"
        onPress={handleLogout}
        style={{
          ...ButtonStyles.buttonMedium,
          ...ButtonStyles.buttonSecondaryColor,
        }}
      />
      {/* Add more settings options here in the future */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CommonStyles.view.backgroundColor,
  },
});

export default SettingsScreen;
