import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Import Text from react-native
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTaskById } from '../../lib/appwrite';
import EditTask from '../../components/EditTask';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Edit = () => {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId);
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  if (loading) {
    return <Text>Loading...</Text>; // Ensure Text is properly imported
  }

  if (!task) {
    return <Text>Task not found.</Text>; // Ensure Text is properly imported
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[70vh] px-2">
            <EditTask
              $id={task.$id}
              taskname={task.taskname}
              priority={task.priority}
              date={task.date}
              description={task.description}
              onCancel={() => router.back()} // Navigate back on cancel
              fetchTasks={() => {}}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Edit;
