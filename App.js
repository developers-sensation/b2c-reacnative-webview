import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import B2CLoginPage from './src/Components/B2CLoginPage';
import HomeScreen from './src/Components/HomeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="B2CLogin" component={B2CLoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;