import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import FormField from './FormField';
import TimeTaskTime from './TimeTaskTime';
import CustomButton from './CustomButton';
import PrioritySelector from './PrioritySelector';

import { updateTask } from '../lib/appwrite';
import { useGlobalContext } from "../context/GlobalProvider";
import { useRouter } from 'expo-router'; // Import router

const EditTask = ({ $id, taskname, priority, date, description, onCancel, fetchTasks }) => {
  const [form, setForm] = useState({
    taskname: taskname,
    date: date,
    priority: priority[0],
    description: description || ''
  });

  const router = useRouter(); // Initialize router


  const { user } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useFocusEffect to fetch tasks when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, []) // Empty dependency array to run this only when the screen is focused
  );

  const handleDateChange = (isoString) => {
    setForm({ ...form, date: isoString });
  };

  const handlePriorityChange = (priority) => {
    setForm({ ...form, priority });
  };

  const submit = async () => {
    if (form.taskname === "") {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTask($id, form.taskname, form.date, form.priority, form.description);
      Alert.alert("Success", "Task Updated");
      fetchTasks(); // Refresh the task list after update
      onCancel(); // Close the edit form after update
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[70vh] px-4 my-2">
            <View className="flex my-0 px-4 space-y-6">
              <View className="flex justify-center items-center flex-row mt-2">
                
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Text className="font-psemibold text-xl text-white">
                    Edit your task here {user?.username}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
            <FormField
              title="Taskname"
              value={form.taskname}
              handleChangeText={(e) => setForm({ ...form, taskname: e })}
              otherStyles="mt-5"
              multiline={false}
            />
            <TimeTaskTime
              title="Start Date and Time"
              value={form.date}
              handleChangeText={handleDateChange}
              otherStyles="mt-7"
            />

            <PrioritySelector
              title="Priority"
              selectedValue={form.priority}
              handleChange={handlePriorityChange}
              otherStyles="mt-7"
            />
            <FormField
              title="Description"
              value={form.description}
              handleChangeText={(e) => setForm({ ...form, description: e })}
              otherStyles="mt-7"
              multiline={true}
              height={120}
            />

            <CustomButton
              title="Update"
              handlePress={submit}
              containerStyle="mt-7 mb-2"
              isLoading={isSubmitting}
              colorButton="bg-secondary"
            />
            <CustomButton
              title="Cancel"
              handlePress={onCancel}
              containerStyle="mt-4"
              colorButton="bg-red-500"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default EditTask;
