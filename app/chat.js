import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Chat() {

    //get parameter
    const item = useLocalSearchParams();
    // console.log(item.other_user_id);

    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState();

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

    useEffect(
        () => {
            async function fetchChatArray() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch("http://192.168.1.3:8080/SmartChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
                if (response.ok) {
                    let chatArray = await response.json();
                    // console.log(chatArray);
                    setChatArray(chatArray);
                }
            }
            fetchChatArray();
            setInterval(() => {
                fetchChatArray();
            }, 5000);
        }, []
    );

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={["#eb1a32", "#f777c8"]} style={stylesheet.view1}>
            <StatusBar hidden={true} />

            <View style={stylesheet.centerView}>

                <View style={stylesheet.view2}>
                    <View style={stylesheet.view3}>
                        {
                            item.avatar_image_found == "true" ? <Image
                                source={{ uri: "http://192.168.1.3:8080/SmartChat/AvatarImages/" + item.other_user_mobile + ".png" }}
                                contentFit="contain"
                                style={stylesheet.image1}
                            />
                                :
                                <Text style={stylesheet.text1}>{item.avatar_image_letter}</Text>
                        }
                    </View>
                    <View style={stylesheet.view4}>
                        <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                        <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                    </View>
                </View>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>

                            <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                                <Text style={stylesheet.text4}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text5}>{item.datetime}</Text>
                                    {
                                        item.side == "right"
                                            ? <FontAwesome6 name={"check"} size={18} color={item.status == 1 ? "green" : "red"} /> : null
                                    }

                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />

            </View>

            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} value={getChatText} cursorColor={"black"} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {

                        if (getChatText.length == 0) {
                            Alert.alert("Erroe", "Please enter your message");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch("http://192.168.1.3:8080/SmartChat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText)
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    // console.log("Message start");
                                    setChatText("");
                                }
                            }
                        }
                    }
                }>
                    <FontAwesome6 name={"paper-plane"} size={18} color={"red"} />
                </Pressable>
            </View>

        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
        },
        view2: {
            // backgroundColor: "white",
            marginTop: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 10,
            justifyContent: "center",
            alignItems: "center",
        },
        view3: {
            backgroundColor: "yellow",
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: 2,
        },
        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
        },
        text1: {
            fontFamily: "Inter_18pt-Bold",
            fontSize: 40,
        },
        view4: {
            rowGap: 3,
        },
        text2: {
            fontFamily: "Inter_18pt-Bold",
            fontSize: 23,
        },
        text3: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 14,
        },
        view5_1: {
            backgroundColor: "yellow",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,
        },
        view5_2: {
            backgroundColor: "yellow",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
        },
        view6: {
            flexDirection: "row",
            columnGap: 10,
        },
        text4: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 18,
        },
        text5: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 12,
        },
        view7: {
            flexDirection: "row",
            columnGap: 10,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            margin: 10,
        },
        input1: {
            height: 40,
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 2,
            fontFamily: "GowunBatang-Bold",
            fontSize: 15,
            flex: 1,
            paddingStart: 10,
        },
        pressable1: {
            backgroundColor: "yellow",
            borderRadius: 35,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
        },
        centerView: {
            flex: 1,
            marginVertical: 20,
        },
    }
)