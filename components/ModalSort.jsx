import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

const ModalSort = ({ visible, onClose, sortBy, setSortBy }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        intensity={100} // Adjust the blur amount to your liking
        tint="dark" // You can choose "light", "dark", or "extraDark"
      >
        <View className="bg-black shadow-lg border border-gray-700 p-6 rounded-lg w-80 relative">
          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="absolute top-0 right-0 px-2"
          >
            <Text className="text-red text-4xl">×</Text>
          </Pressable>

          <Text className="font-psemibold text-lg text-white mb-4 text-center">
            Sort Tasks By
          </Text>

          <Pressable
            onPress={() => { setSortBy('date'); onClose(); }}
            className="mb-2 m-2"
          >
            <Text className={sortBy === 'date' ? 'text-secondary-100' : 'text-white'}>
              Date
            </Text>
          </Pressable>

          <Pressable
            onPress={() => { setSortBy('taskname'); onClose(); }}
            className="mb-2 m-2"
          >
            <Text className={sortBy === 'taskname' ? 'text-secondary-100' : 'text-white'}>
              Name
            </Text>
          </Pressable>

          <Pressable
            onPress={() => { setSortBy('priority'); onClose(); }}
            className="mb-2 m-2"
          >
            <Text className={sortBy === 'priority' ? 'text-secondary-100' : 'text-white'}>
              Priority
            </Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text className="text-red-500 mt-4 text-center">Cancel</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ModalSort;
