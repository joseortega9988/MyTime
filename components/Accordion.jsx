import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { icons } from '../constants'; // Assuming your icons are imported from constants

const Accordion = ({ title, children, itemCount, onSeeMorePress }) => {
  // Set expanded to true by default
  const [expanded, setExpanded] = useState(true);
  const [animation] = useState(new Animated.Value(1)); // Set the animation to fully expanded

  const toggleAccordion = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust this value depending on your content's height
  });

  return (
    <View>
      <View className="flex flex-row items-center py-4">
        {/* Arrow Icon that toggles the accordion */}
        <TouchableOpacity onPress={toggleAccordion} className="mr-2">
          <Image
            source={expanded ? icons.downArrow  : icons.rightArrow} // Toggle arrow direction
            tintColor= 'white'
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View className="flex-grow flex-row items-center">
          <Text className="font-psemibold text-xl text-white">
            {title} ({itemCount})
          </Text>

          {/* See more option */}
          <TouchableOpacity onPress={onSeeMorePress}>
            <Text className="text-xs text-gray-300 ml-2">See more</Text>
          </TouchableOpacity>
        </View>

        {/* Optional elements that can go to the right (e.g., a sort button) */}
        <View className="ml-auto">
          {/* You can add any other elements here */}
        </View>
      </View>

      <Animated.View style={{ height: expanded ? null : heightInterpolation, overflow: 'hidden' }}>
        {children}
      </Animated.View>
    </View>
  );
};

export default Accordion;


