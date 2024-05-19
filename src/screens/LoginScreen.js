import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar
} from "react-native";
import { Text } from "react-native-paper";
import COLORS from "../constants/Colors";
const { width } = Dimensions.get("screen");
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import InteractiveTextInput from "react-native-text-input-interactive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Animatable from "react-native-animatable";

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    const loadStoredUsername = async () => {
      try {
        const storedLoginInfo = await AsyncStorage.getItem("lastLoginInfo");
        if (storedLoginInfo) {
          const {
            email,
            password,
            rememberMe: storedRememberMe,
          } = JSON.parse(storedLoginInfo);
          setEmail(email);
          setPassword(password);
          setRememberMe(storedRememberMe);
        }
      } catch (error) {
        console.error("Error loading stored login information:", error);
      }
    };
    loadStoredUsername();
  }, []);

  const onIconPress = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const saveLoginInfo = async () => {
    try {
      await AsyncStorage.setItem(
        "lastLoginInfo",
        JSON.stringify({ email, password, rememberMe })
      );
    } catch (error) {
      console.error("Error saving login information to AsyncStorage:", error);
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Notes");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fingerprintAuthentication = async () => {
    try {
      const isAuthenticated = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Fingerprint",
        fallbackLabel: "Enter Password",
      });

      if (isAuthenticated.success) {
        if (rememberMe) {
          try {
            const storedLoginInfo = await AsyncStorage.getItem("lastLoginInfo");
            if (storedLoginInfo) {
              const { password: storedPassword } = JSON.parse(storedLoginInfo);
              setPassword(storedPassword);
            }
          } catch (error) {
            console.error("Error loading stored login information:", error);
          }

          handleLogin();
        } else {
          console.log(
            "Remember Me is not checked. Handle this case accordingly."
          );
        }
      }
    } catch (error) {
      console.error("Fingerprint authentication error:", error);
    }
  };

  const AnimatedBottomLine = () => {
    const [lineWidth] = useState(new Animated.Value(0));

    const animateLine = () => {
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    };

    useEffect(() => {
      animateLine();
    }, []);

    const lineStyle = {
      backgroundColor: "#2a41cb", // Set your desired line color
      height: 2,
      marginTop: 10,
      width: lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "50%"],
      }),
    };

    return <Animated.View style={lineStyle} />;
  };

  const renderHeader = () => (
    <View style={{ marginTop: 24 }}>
      <Animatable.View animation="fadeInUp" duration={800}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 32 }}>
          Welcome Back 👋
        </Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={900}>
        <Text style={{ color: "#fff", letterSpacing: 1, marginTop: 8 }}>
          I am so happy to see you.
        </Text>
      </Animatable.View>
    </View>
  );

  const renderRememberMeButton = () => (
    <Animatable.View
      animation="fadeInUp"
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginLeft: 2,
        marginTop: -20,
      }}
    >
      <TouchableOpacity
        style={{
          height: 24,
          width: 24,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#BACD92",
          marginRight: 10,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 5,
        }}
        onPress={() => {
          setRememberMe(!rememberMe);
          saveLoginInfo();
        }}
      >
        {rememberMe && (
          <Image
            source={require("../assets/checkbox.jpeg")}
            style={{ width: 25, height: 25, borderRadius: 20 }}
          />
        )}
      </TouchableOpacity>
      <Text style={{ fontWeight: "600", color: "#fff" }}>Remember Me</Text>
    </Animatable.View>
  );

  const renderTextInputs = () => (
    <Animatable.View animation="fadeInUp" style={{ marginTop: 52 }}>
      <InteractiveTextInput
        textInputStyle={{ width: width * 0.88 }}
        label="Username"
        mode="outlined"
        placeholder="Username"
        autoCapitalize="none"
        color={COLORS.black}
        placeholderTextColor={COLORS.gray}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InteractiveTextInput
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          enableIcon
          textInputStyle={{
            width: width * 0.7,
          }}
          iconImageSource={
            passwordVisible
              ? require("../assets/visibility-button.png")
              : require("../assets/invisible.png")
          }
          onIconPress={onIconPress}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#A367B1",
            borderWidth: 1,
            borderRadius: 8,
          }}
          onPress={() => fingerprintAuthentication()}
        >
          <Image
            source={require("../assets/fingerprint.png")}
            style={{ height: 25, width: 25, tintColor: "#A367B1" }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ marginLeft: "auto", marginTop: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "500" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderLoginButton = () => (
    <Animatable.View animation="fadeInUp" duration={900}>
      <TouchableOpacity
        style={{
          height: 50,
          width: width * 0.88,
          backgroundColor: "#5D3587",
          marginTop: width * 0.4,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          shadowRadius: 8,
          shadowOpacity: 0.3,
          shadowColor: "#5D3587",
          shadowOffset: {
            width: 0,
            height: 5,
          },
        }}
        onPress={() => handleLogin(email, password)}
      >
        <Text style={{ fontWeight: "bold", color: "#fff" }}>Login</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#392467",
      }}
    >
      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        <StatusBar
        animated={true}
        backgroundColor="#61dafb"
      />
        {renderHeader()}
        {renderTextInputs()}
        {renderRememberMeButton()}
        {renderLoginButton()}
      </View>
    </SafeAreaView>
  );
};
export default LoginScreen;
