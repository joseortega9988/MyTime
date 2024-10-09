import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import TaskList from '../../components/TaskList';
import SortTasks from '../../components/SortTasks';
import { GetUserTasks } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState'; // Importing the EmptyState component

import ModalSort from '../../components/ModalSort'; // Importing the new ModalSort component

const ToDoList = () => {
  const { user } = useGlobalContext();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // Default sorting by date
  const [modalVisible, setModalVisible] = useState(false); // Toggle modal visibility

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await GetUserTasks(user.$id);
      const incompleteTasks = fetchedTasks.filter((task) => !task.status); // Filter only incomplete tasks
      setTasks(SortTasks(incompleteTasks, sortBy)); // Sort tasks after fetching
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

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-center items-center mb-6">
          <View>
            <Text className="text-2xl font-psemibold text-white">
              To-Do Tasks ({tasks.length})
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View className="flex flex-row items-center mt-4">
              <Text className="font-psemibold text-xs text-white mr-2">
                Sort :
              </Text>
              <Text className="font-psemibold text-xs text-white">
                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {tasks.length === 0 ? (
        <EmptyState 
        title="No To-Do Tasks" 
        subtitle="Create a Task"
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <TaskList task={item} fetchTasks={fetchTasks} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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

export default ToDoList;
