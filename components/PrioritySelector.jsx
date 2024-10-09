import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

// Mid and low have a special with the propuse of the 3 priorities have 4 lettes 
const PrioritySelector = ({ title, selectedValue, handleChange, otherStyles }) => {
  const priorities = ['High', 'Mid​ ', 'Low​ '];

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="flex-row justify-between">
        {priorities.map((priority) => {
          const isSelected = selectedValue === priority;
          const backgroundColor =
            priority === 'High' && isSelected
              ? 'bg-red-priority'
              : priority === 'Mid​ ' && isSelected
              ? 'bg-yellow-priority'
              : priority === 'Low​ ' && isSelected
              ? 'bg-green-priority'
              : 'bg-black-100 border-2 border-darkblue';

          return (
            <TouchableOpacity
              key={priority}
              onPress={() => handleChange(isSelected ? null : priority)} // Toggle selection
              className={`flex-1 h-16 mx-1 rounded-2xl items-center justify-center ${backgroundColor}`}
            >
              <Text className={`text-base font-psemibold ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                {priority}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default PrioritySelector;
