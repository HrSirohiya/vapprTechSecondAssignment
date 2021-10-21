import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailsScreen, HomeScreen} from './Screens';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  HomeScreen: undefined;
  DetailsScreen: {
    name: string;
    nasaJplUri:string;
    isPotentiallyHazardousAsteroid:string;


  };
};

const App: React.FC<RootStackParamList> = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;