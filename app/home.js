import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function home() {

    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts(
        {
            "Inter_18pt-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
            "PlaywriteDEGrund-Light": require("../assets/fonts/PlaywriteDEGrund-Light.ttf"),
            "GowunBatang-Bold": require("../assets/fonts/GowunBatang-Bold.ttf"),
        }
    );

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch("http://192.168.1.3:8080/SmartChat/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();
                    if (json.success) {
                        let chatArray = json.jsonChatArray;
                        // console.log(chatArray);
                        setChatArray(chatArray);
                    }
                }
            }
            fetchData();
        }, []
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

            <FlashList
                data={getChatArray}
                renderItem={
                    ({ item }) =>
                        <Pressable style={stylesheet.view5}
                            onPress={
                                () => {
                                    // Alert.alert("View Chat","User:"+item.other_user_id);
                                    router.push(
                                        {
                                            pathname: "/chat",
                                            params: item
                                        }
                                    );
                                }
                            }
                        >

                            <View style={item.other_user_status == 1 ? stylesheet.view6_2 : stylesheet.view6_1}>
                                {
                                    item.avatar_image_found ?
                                        <Image
                                            source={{ uri: "http://192.168.1.3:8080/SmartChat/AvatarImages/" + item.other_user_mobile + ".png" }}
                                            contentFit="contain"
                                            style={stylesheet.image1}
                                        />
                                        :
                                        <Text style={stylesheet.text6}>{item.avatar_image_letter}</Text>
                                }
                            </View>

                            <View style={stylesheet.view4}>
                                <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                                <Text style={stylesheet.text4} numberOfLines={1}>{item.message}</Text>

                                <View style={stylesheet.view7}>
                                    <Text style={stylesheet.text5}>{item.datetime}</Text>
                                    <FontAwesome6 name={"check"} size={18} color={item.chat_status_id == 1 ? "green" : "white"} />
                                </View>
                            </View>
                        </Pressable>
                }
                estimatedItemSize={200}
            />

        </LinearGradient >

    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            paddingVertical: 30,
            paddingHorizontal: 25,
        },

        text1: {
            fontFamily: "Inter_18pt-Bold",
            fontSize: 22,
        },
        text2: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 16,
        },
        text3: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 14,
            alignSelf: "flex-end",
        },
        view4: {
            flex: 1,
        },
        view5: {
            flexDirection: "row",
            marginVertical: 10,
            columnGap: 20,
        },
        view6_1: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "orange",
            justifyContent: "center",
            alignItems: "center",
        },
        view6_2: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
        },
        text4: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 16,
            overflow: "hidden",
            height: 20,
        },
        text5: {
            fontFamily: "GowunBatang-Bold",
            fontSize: 14,
            alignSelf: "flex-end",
        },
        scrollView1: {
            marginTop: 10,
        },
        view7: {
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: "center",
        },
        text6: {
            fontFamily: "Inter_18pt-Bold",
            fontSize: 32,
            color: "red",
        },
        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "white",
            justifyContent: "center",
            alignSelf: "center",
        },
    }
);