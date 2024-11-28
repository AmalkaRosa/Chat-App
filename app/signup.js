import { Image, StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function signup() {

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [getImage, setImage] = useState(null);

  const logoPath = require("../assets/Images/logo.png");

  const [loaded, error] = useFonts(
    {
      "Inter_18pt-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
      "PlaywriteDEGrund-Light": require("../assets/fonts/PlaywriteDEGrund-Light.ttf"),
      "GowunBatang-Bold": require("../assets/fonts/GowunBatang-Bold.ttf"),
    }
  );

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  return (

    <LinearGradient colors={["#eb1a32", "#f777c8"]} style={stylesheet.view1}>

      <StatusBar hidden={true} />

      <ScrollView >
        <View style={stylesheet.view2}>
          <Image source={logoPath} style={stylesheet.image1} contentFit={"contain"} />

          <Text style={stylesheet.text1}>Create Account</Text>
          <Text style={stylesheet.text2}>Hello! Welcome to Smart Chat, Let's start the Conversation.</Text>

          <Pressable style={stylesheet.selectImage} onPress={
            async () => {

              let result = await ImagePicker.launchImageLibraryAsync(
                {}
              );

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }

            }
          } >
            <Image source={{ uri: getImage }} style={stylesheet.selectImage} contentFit={"contain"} ></Image>
          </Pressable>

          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput style={stylesheet.input1} inputMode={"tel"} cursorColor={"black"} maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }
          } />

          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} cursorColor={"black"} onChangeText={
            (text) => {
              setFirstName(text);
            }
          } />

          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} cursorColor={"black"} onChangeText={
            (text) => {
              setLastName(text);
            }
          } />

          <Text style={stylesheet.text3}>Password</Text>
          <TextInput style={stylesheet.input1} secureTextEntry={true} inputMode={"text"} cursorColor={"black"} maxLength={20} onChangeText={
            (text) => {
              setPassword(text);
            }
          } />

          <Pressable style={stylesheet.pressable1} onPress={
            async () => {

              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != null) {
                formData.append("avatarImage",
                  {
                    name: "avatar.png",
                    type: "image/png",
                    uri: getImage,
                  }
                );
              }

              let response = await fetch(
                "http://192.168.1.3:8080/SmartChat/SignUp",
                {
                  method: "POST",
                  body: formData
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  //user registration complete
                  router.replace("/");
                } else {
                  //problem occured
                  Alert.alert("Error", json.message);
                }
              }

            }
          }>
            <FontAwesome6 name={"right-to-bracket"} size={18} color={"white"} />
            <Text style={stylesheet.text4}>Sign Up</Text>
          </Pressable>

          <Pressable style={stylesheet.pressable2} onPress={
            () => {
              router.replace("/");
            }
          }>
            <Text style={stylesheet.text5}>Already registered? Please Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>

  );
}

const stylesheet = StyleSheet.create(
  {
    view1: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#f595c3",
    },
    ScrollView1: {
      rowGap: 10,
      paddingHorizontal: 20,
    },
    image1: {
      height: 170,
      width: "100%",
    },
    text1: {
      fontSize: 32,
      fontFamily: "Inter_18pt-Bold",
    },
    text2: {
      fontSize: 20,
      fontFamily: "PlaywriteDEGrund-Light",
    },
    text3: {
      fontSize: 18,
      fontFamily: "GowunBatang-Bold",
    },
    input1: {
      width: "100%",
      height: 50,
      borderRadius: 15,
      borderStyle: "solid",
      borderWidth: 2,
      paddingStart: 10,
      fontSize: 15,
    },
    pressable1: {
      height: 50,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 10,
      flexDirection: "row",
      columnGap: 10,
    },
    text4: {
      fontSize: 18,
      fontFamily: "GowunBatang-Bold",
      color: "white",
    },
    pressable2: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 10,
    },
    text5: {
      fontSize: 18,
      fontFamily: "GowunBatang-Bold",
    },
    selectImage: {
      width: 150,
      height: 150,
      borderRadius: 100,
      backgroundColor: "white",
      justifyContent: "center",
      alignSelf: "center",
    },
    view2: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
      rowGap: 10,
    },
  }
);