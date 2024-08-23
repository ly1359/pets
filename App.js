import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen/HomeScreen';
import AddPetScreen from './components/AddPetScreen/AddPetScreen';
import DetailsScreen from './components/DetailsScreen/DetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerTransparent: true,
        }}/>
         <Stack.Screen name="Add" component={AddPetScreen}options={{
          headerTransparent: true,
          headerTitle: 'Cadastro',
        }}/>
        <Stack.Screen name="Details" component={DetailsScreen} options={{
          headerTransparent: true,
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}