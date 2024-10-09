import { StyleSheet, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import { Redirect,router } from "expo-router";
import {images} from '../constants'
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App () {
  const {isLoading , IsLoggedIn} = useGlobalContext();

  if (!isLoading && IsLoggedIn) return <Redirect href = "/home"/>
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className= "bg-primary h-full">
        <ScrollView contentContainerStyle = {{height : '100%'}}>
          <View className= "w-full justify-center items-center min-h-[85vh] px-4 py-4">
            <Image
              // Image LOGO
              source = {images.logo}
              className="w-full h-[70px] items-center"
              resizeMode="contain"
            />
            <Image 
              // Image CARDS
              source = {images.cards}
              className= "max-2-[380px] w-full h-[300px] my-4"
              resizeMode= 'expand'
            />
            <View className = "relative mt-5 object-contain " >
              <Text className = "text-3xl text-white font-bold text-center" >Organize, prioritize, and get all tasks done with 
                <Text className= "text-secondary-200"> MYTIME</Text>
              </Text>
              
              <Image
              //Image Of the line below Mytime
              source={images.path}
              className = "w-[150px] h-[15px] absolute -bottom-2 right-28"
              resizeMode='contain'
              >

              </Image>

            </View>
            <Text className = "text-sm font-pregular text-gray-100 mt-7 text-center">Take control of your time, one task at a time.</Text>
            <CustomButton
              title = "Continue with e-mail"
              handlePress ={() => router.push ('/sign-in')}
              containerStyle = "w-full mt-7"
              colorButton = "bg-secondary"
            />

          </View>
        </ScrollView>
      {/* HIDE THE STATUS BAR OR SHOW IT */}
      <StatusBar backgroundColor="#161622" style="light"/>
      </SafeAreaView>
          {/* content */}
    </GestureHandlerRootView>
  );
}
