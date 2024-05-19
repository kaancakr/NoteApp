import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../constants/Colors";
import Icon from "react-native-vector-icons/Ionicons";

const FullNoteScreen = ({ route }) => {
  const { note } = route.params;
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back-outline" size={25} color={COLORS.red} />
      </TouchableOpacity>
      <Text style={styles.fullNote}>{note}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  fullNote: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});

export default FullNoteScreen;
