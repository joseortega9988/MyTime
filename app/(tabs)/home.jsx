import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { images, icons } from '../../constants';
import EmptyState from '../../components/EmptyState';
import TaskList from '../../components/TaskList';
import SortTasks from '../../components/SortTasks';
import { GetUserTasks } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

import ModalSort from '../../components/ModalSort'; // Importing the new ModalSort component
import { useRouter } from 'expo-router'; // Import router
import Accordion from '../../components/Accordion'; // Importing the Accordion component

const Home = () => {
  const { user } = useGlobalContext();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // Default sorting by date
  const [modalVisible, setModalVisible] = useState(false); // Toggle modal visibility
  const router = useRouter(); // Initialize router
  
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await GetUserTasks(user.$id);
      setTasks(SortTasks(fetchedTasks, sortBy)); // Sort tasks after fetching
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [sortBy]) // Re-fetch tasks whenever the sort order changes
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Divide tasks into completed and incomplete
  const incompleteTasks = tasks.filter((task) => !task.status);
  const completedTasks = tasks.filter((task) => task.status);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text className="text-2xl font-psemibold text-white">
                {user?.username}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-1.5">
            <Image
              source={images.logoSmall}
              className="w-20 h-12"
              resizeMode="center"
            />
          </View>
        </View>
        
        {/* Modal Sort Button on the Right */}
        <View className="flex flex-row justify-end -mb-14">
          <TouchableOpacity onPress={() => setModalVisible(true)} className="ml-auto">
            <View className="flex flex-row items-center">
              <Text className="font-psemibold text-xs text-white mr-2">
                Sort :
              </Text>
              <Image
                source={icons.sort} // Replace with your settings icon path
                tintColor= 'white'
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {tasks.length === 0 ? (
        // Display EmptyState when there are no tasks at all
        <EmptyState title="No Tasks Found" subtitle="Create your first task here" />
      ) : (
        <View>
          <View className="flex px-0.5 space-y-6 justify-start">
            {/* To-Do Tasks */}
            <Accordion
              title="To-Do Tasks"
              itemCount={incompleteTasks.length}
              onSeeMorePress={() => router.push('/extra-screens/to-do-list')}
            >
              <FlatList
                data={incompleteTasks}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <TaskList task={item} fetchTasks={fetchTasks} />}
              />
            </Accordion>
          </View>

          {/* Completed Tasks */}
          <View className="flex my-2  px-0.5">
            <Accordion
              title="Completed Tasks"
              itemCount={completedTasks.length}
              onSeeMorePress={() => router.push('/extra-screens/complete-list')}
            >
              <FlatList
                data={completedTasks}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <TaskList task={item} fetchTasks={fetchTasks} />}
              />
            </Accordion>
          </View>
        </View>
      )}

      {/* Modal for Sorting Options */}
      <ModalSort
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </SafeAreaView>
  );
};

export default Home;
