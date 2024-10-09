import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'; // Import router


import {images} from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts , getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

import { useGlobalContext } from '../../context/GlobalProvider'

const Learn = () => {

  const {data: posts , refetch} = useAppwrite(getAllPosts)

  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const {user,setUser, setIsLogged} = useGlobalContext ();

  const router = useRouter(); // Initialize router



  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing (true) ;
    await refetch () ; 
    setRefreshing (false) ;
  }

  //console.log (posts)
  return (
    <SafeAreaView className = "bg-primary h-full">
      <FlatList
        //data = {[{id : 1 }, {id : 2 },{id : 3 },]}
        data = {posts}

        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video = {item}/>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Time to Learn tools for you
                </Text>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
                </TouchableOpacity>
              </View>
              <View className = "mt-1.5">
                <Image 
                  source = {images.logoSmall}
                  className = 'w-20 h-12'
                  resizeMode = "center"
                />
              </View>
          </View>
          <SearchInput/>
          <View className = "w-full flex-1 pt-5 pb-8">
            <Text className= "text-gray-100 text-lg font-pregular mb-3">
              Latest Videos
            </Text>

            <Trending posts={latestPosts ?? []} />

          </View>

        </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title = "No Videos Found"
            subtitle = "Be the First one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

      />
    </SafeAreaView>
  )
}

export default Learn
