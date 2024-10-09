import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import { updateTaskStatus } from '../lib/appwrite';
import getDateStatus from '../components/GetDateStatus';
import diacritics from 'diacritics';
import { useRouter } from 'expo-router';

const CalendarList = ({ task, fetchTasks }) => {
  const { $id, taskname, priority, status, date } = task;
  const [isChecked, setIsChecked] = useState(status);
  const router = useRouter();

  const handleCheckboxChange = async (newValue) => {
    setIsChecked(newValue);
    try {
      await updateTaskStatus($id, newValue);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
      setIsChecked(status);
    }
  };

  const priorityLabel = priority && priority.length > 0 ? priority[0] : "No Priority";
  const priorityLabelNormalized = diacritics.remove(priorityLabel);
  const priorityStyles = priorityLabelNormalized === 'High'
    ? 'bg-red-priority text-white'
    : priorityLabelNormalized === 'Mid​ '
    ? 'bg-yellow-priority text-white'
    : 'bg-green-priority text-white';

  // Get the status of the date (e.g., Today, Tomorrow, Expired)
  const dateStatus = getDateStatus(date);

  // Extract the time from the date
  const time = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/extra-screens/edit-task', params: { taskId: $id } })}>
      <View className="flex-row items-center justify-between px-4 mb-4 bg-black-100 rounded-lg p-4">
        <View className="flex-none w-8">
          <Checkbox
            value={isChecked}
            onValueChange={handleCheckboxChange}
            color={isChecked ? '#4630EB' : undefined}
          />
        </View>

        <View className="flex-grow mx-2">
          <Text className="text-white font-psemibold text-base" numberOfLines={1}>
            {taskname}
          </Text>
        </View>

        <View className="flex-none w-15">
          <View className={`rounded-lg px-3 py-1 ${priorityStyles} items-center justify-center`}>
            <Text className="font-psemibold text-xs text-center">
              {priorityLabelNormalized}
            </Text>
          </View>
        </View>

        <View className="flex w-24 flex-row items-center justify-start ml-2">
          <Text className="text-gray-300 text-xs">
            Due:
          </Text>
          <View className="text-center">
            <Text className={`text-xs ml-1 ${dateStatus.startsWith('Expired') || dateStatus === 'Yesterday' ? 'text-red-500' : 'text-gray-300'} text-center`}>
              {time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CalendarList;
