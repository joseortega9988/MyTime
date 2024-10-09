import { View, Text, Image, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import InfoBox from '../../components/InfoBox';
import EmptyState from '../../components/EmptyState';
import { GetUserTasks, signOut, getAllPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [tasks, setTasks] = useState([]);
  const [recommendedVideo, setRecommendedVideo] = useState(null);
  const { data: posts } = useAppwrite(getAllPosts); // Fetch all posts (videos)
  const [refreshing, setRefreshing] = useState(false);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace('/');
  };

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await GetUserTasks(user.$id);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const selectRandomVideo = () => {
    if (posts && posts.length > 0) {
      const randomIndex = Math.floor(Math.random() * posts.length);
      setRecommendedVideo(posts[randomIndex]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (posts && posts.length > 0) {
      selectRandomVideo();
    }
  }, [posts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Calculate the counts
  const completedTasksCount = tasks.filter(task => task.status).length;
  const toDoTasksCount = tasks.filter(task => !task.status).length;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image
              source={{ uri: user?.avatar }}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode="cover"
            />
          </View>
          <InfoBox
            title={user?.username}
            containerStyles="mt-5"
            titleStyles="text-lg"
          />
          <View className="mt-3 flex-row">
            <InfoBox
              title={toDoTasksCount}
              subtitle="To-Do Tasks"
              containerStyles="mr-10"
              titleStyles="text-xl"
            />
            <InfoBox
              title={completedTasksCount}
              subtitle="Completed Tasks"
              titleStyles="text-xl"
            />
          </View>
        </View>

        {recommendedVideo && (
          <View className="px-4 -mb-10">
            <View className= "justify-center items-center mb-4">

            <Text className="text-gray-100 text-lg font-pregular mb-3">
              Here is a video recommended for you
            </Text>
            </View>
            <VideoCard video={recommendedVideo} />
          </View>
        )}

        <View className="px-4 pb-4">
          <CustomButton
            title="Log Out"
            handlePress={logout}
            containerStyle="mt-7"
            colorButton="bg-red"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
