import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import TimeField from '../../components/TimeField';
import CustomButton from '../../components/CustomButton';
import PrioritySelector from '../../components/PrioritySelector';

import { Link, router } from 'expo-router';
import { createTask, GetUserTasks } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {

  
  const [form, setForm] = useState({
    taskname: '',
    date: '',
    priority: '',
    description: ''
  });


  const handleDateChange = (isoString) => {
    setForm({ ...form, date: isoString });
  };

  const handlePriorityChange = (priority) => {
    setForm({ ...form, priority });
  };

  const {user,setUser, setIsLogged} = useGlobalContext ();

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await GetUserTasks(user.$id);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    // For the user to fill all the fields 
    if (form.taskname === "" ) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createTask(form.taskname, form.date, form.priority, form.description, user.$id);

      await fetchTasks();
      //console.log("Task creation result:", result); // Log the result to inspect
     // Reset form fields

      Alert.alert("Success", "Task Created");
      setForm({
        taskname: '',
        date: '',
        priority: '',
        description: ''
      });
      router.replace('/home');
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
              <View className="flex justify-center items-center flex-row mt-4">
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Text className="font-psemibold text-xl text-white">
                    Create a task here {user?.username}
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
            <TimeField
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
              handleChangeText={(e) => setForm({ ...form, description : e })}
              otherStyles="mt-7"
              multiline={true}
              height={120}
            />

            <CustomButton
              title="Create"
              handlePress={submit}
              containerStyle="mt-7"
              isLoading={isSubmitting}
              colorButton = "bg-secondary"

            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Create
