// TimeField.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimeField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  // Initialize with the passed value or current date/time
  const initialDate = value ? new Date(value) : new Date();

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(initialDate);
  const [mode, setMode] = useState('date');

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDateTime(date);
    }
  }, [value]);

  const handleConfirm = (dateTime) => {
    const newDate = new Date(selectedDateTime);

    if (mode === 'date') {
      // Update the date part
      newDate.setFullYear(dateTime.getFullYear());
      newDate.setMonth(dateTime.getMonth());
      newDate.setDate(dateTime.getDate());
    } else if (mode === 'time') {
      // Update the time part
      newDate.setHours(dateTime.getHours());
      newDate.setMinutes(dateTime.getMinutes());
      newDate.setSeconds(dateTime.getSeconds());
    }

    setSelectedDateTime(newDate);
    handleChangeText(newDate.toISOString()); // Pass ISO string to parent component
    setPickerVisible(false); // Close the picker
  };

  const showDatePicker = () => {
    setMode('date');
    setPickerVisible(true);
  };

  const showTimePicker = () => {
    setMode('time');
    setPickerVisible(true);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="flex-row items-center justify-start space-x-2">
        <TouchableOpacity
          onPress={showDatePicker}
          className="border-2 border-darkblue w-1/2 flex-row h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary-100 items-center"
        >
          <Text className="flex-1 text-white font-psemibold text-base">
            {selectedDateTime ? selectedDateTime.toLocaleDateString() : placeholder}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showTimePicker}
          className="border-2 border-darkblue w-1/2 flex-row h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary-100 items-center"
        >
          <Text className="flex-1 text-white font-psemibold text-base">
            {selectedDateTime ? selectedDateTime.toLocaleTimeString() : 'Pick a Time'}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        date={selectedDateTime}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        {...props}
      />
    </View>
  );
};

export default TimeField;
