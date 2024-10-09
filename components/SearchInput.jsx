import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import { icons } from '../constants'
import { usePathname, router } from 'expo-router'

const SearchInput = ({ initialQuery,title, value, placeholder, handleChangeText, otherStyles, ...props }) => {

  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className="border-2 border-white w-full flex-row h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder || "Search for a time management topic"}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('Missing query', "Please input something to search results across the database")
          }

          if (pathname.startsWith('/search')) router.setParams({ query })
          else router.push(`/search/${query}`)
        }}
      >
        <Image
          source={icons.search}
          className='w-5 h-5'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput