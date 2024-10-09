import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { GetUserTasks } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import CalendarList from '../../components/CalendarList';
import ModalSort from '../../components/ModalSort'; // Import the ModalSort component
import SortTasks from '../../components/SortTasks'; // Import your sorting utility
import { images, icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router'; // Import router

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const [tasks, setTasks] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const router = useRouter(); // Initialize router


  const [selectedDate, setSelectedDate] = useState(() => {
    return new Intl.DateTimeFormat('en-CA').format(new Date());
  });

  const [sortBy, setSortBy] = useState('date'); // Default sorting by date
  const [modalVisible, setModalVisible] = useState(false); // Toggle modal visibility

  useEffect(() => {
    const selectedTasks = tasks.filter(task => adjustToLocalDate(task.date).split('T')[0] === selectedDate);
    setSelectedDateTasks(selectedTasks);
  }, [selectedDate, tasks]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await GetUserTasks(user.$id);
      // Sort tasks: Incomplete tasks (status: false) first, then completed tasks
      const sortedTasks = SortTasks(fetchedTasks, sortBy).sort((a, b) => {
        return a.status === b.status ? 0 : a.status ? 1 : -1;
      });

      setTasks(sortedTasks);
      markTaskDates(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const markTaskDates = (tasks) => {
    const dates = {};

    tasks.forEach(task => {
      const localDate = adjustToLocalDate(task.date).split('T')[0];
      if (!dates[localDate]) {
        dates[localDate] = { marked: true, dots: [] };
      }

      // Push a red dot if the task is incomplete
      if (!task.status) {
        dates[localDate].dots.push({ color: 'red' });
      }

      // Push a green dot if the task is complete
      if (task.status) {
        dates[localDate].dots.push({ color: 'green' });
      }

    });
    
    setMarkedDates(dates);
  };

  const handleDayPress = (day) => {
    const selectedTasks = tasks.filter(task => adjustToLocalDate(task.date).split('T')[0] === day.dateString);
    setSelectedDate(day.dateString);
    setSelectedDateTasks(selectedTasks);
  };

  const adjustToLocalDate = (dateString) => {
    const utcDate = new Date(dateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return localDate.toISOString();
  };

  const formatSelectedDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });

    
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return (
    <View className="flex flex-row justify-between items-center">
        <View className="flex flex-col">
            <Text className="text-white text-lg font-psemibold">
                Tasks for {dayName},
            </Text>
            <Text className="text-white text-lg font-psemibold">
                {parseInt(day)}{daySuffix(day)} of {monthName} {year}
            </Text>
        </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View className="flex flex-row items-center">
                <Text className="font-psemibold text-xs text-white mr-2">
                Sort :
                </Text>
                <Image
                source={icons.sort} // Replace with your settings icon path
                tintColor='white'
                className="w-6 h-6"
                resizeMode="contain"
                />
            </View>
            </TouchableOpacity>
    </View>
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex my-10 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mt-4">
          <View>
            <TouchableOpacity onPress={() => router.push('/profile')}>

              <Text className="font-pmedium text-sm text-gray-100">
                Hello, {user?.username}
              </Text>
            </TouchableOpacity>

            <Text className="text-2xl font-psemibold text-white">
              Your Calendar
            </Text>
          </View>
        </View>
  
        {/* Place the Calendar outside of the ScrollView */}
        <View className="w-full justify-start px-4 my-4">
          <RNCalendar
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                selectedColor: '#4A90E2',
                textColor: 'white',
                marked: markedDates[selectedDate]?.marked,
                dots: markedDates[selectedDate]?.dots,
              },
            }}
            markingType={'multi-dot'}
            theme={{
              calendarBackground: '#1E1E1E',
              textSectionTitleColor: '#FFFFFF',
              selectedDayBackgroundColor: '#4A90E2',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#4A90E2',
              dayTextColor: '#87CEEB',
              textDisabledColor: '#FFFFFF',
              dotColor: '#00adf5',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#FFFFFF',
              monthTextColor: '#FFFFFF',
              indicatorColor: '#FFFFFF',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '400',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            onDayPress={handleDayPress}
          />
        </View>
  
        {/* ScrollView should only wrap the list of tasks */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="w-full justify-start px-4 my-8">
            {selectedDate ? (
              <>
                {formatSelectedDate(selectedDate)}
                {selectedDateTasks.length > 0 ? (
                  selectedDateTasks.map((task) => (
                    <CalendarList
                      key={task.$id}
                      task={task}
                      fetchTasks={fetchTasks}
                    />
                  ))
                ) : (
                  <Text className="text-gray-300">
                    No tasks for this date.
                  </Text>
                )}
              </>
            ) : (
              <Text className="text-gray-300">
                Select a date to see tasks.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
  
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

export default CalendarScreen;
