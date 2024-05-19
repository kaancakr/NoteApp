import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import * as Animatable from "react-native-animatable";
import COLORS from "../constants/Colors";

const { width } = Dimensions.get("screen");

const NoteScreen = ({ navigation }) => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const notesQuery = query(
      collection(firestore, "notes"),
      where("to", "==", user.email)
    );
    const unsubscribe = onSnapshot(notesQuery, (querySnapshot) => {
      const notes = [];
      querySnapshot.forEach((documentSnapshot) => {
        notes.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
      setNotes(notes);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendNote = () => {
    if (!user || !note.trim()) return;

    const recipientEmail =
      user.email === "erenkaancakr@gmail.com"
        ? "zeynepnyuksell@gmail.com"
        : "erenkaancakr@gmail.com";

    addDoc(collection(firestore, "notes"), {
      from: user.email,
      to: recipientEmail,
      text: note,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        setNote("");
      })
      .catch((error) => {
        console.error("Error adding note: ", error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleNotePress = (note) => {
    navigation.navigate("FullNote", { note });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Animatable.View animation={"fadeInUp"}>
          <TextInput
            style={styles.input}
            placeholder="Write a note"
            value={note}
            onChangeText={setNote}
            placeholderTextColor={COLORS.white}
            multiline={true}
          />
          <TouchableOpacity onPress={handleSendNote} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNotePress(item.text)}>
              <View style={styles.note}>
                <Text style={styles.noteText}>{item.text}</Text>
                <Text style={styles.noteMeta}>From: {item.from}</Text>
                <Text style={styles.noteMeta}>To: {item.to}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  input: {
    height: 100,
    borderColor: "white",
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    width: width * 0.9,
    color: COLORS.white,
    fontSize: 14,
  },
  sendButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundSecondary,
    borderColor: COLORS.backgroundSecondary,
    marginTop: 10,
  },
  sendButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  listContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
  },
  note: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 8,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: 10,
  },
  noteText: { fontSize: 16 },
  noteMeta: { fontSize: 12, color: "white" },
});

export default NoteScreen;