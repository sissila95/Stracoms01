import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import { Colors } from './src/theme/colors';
import { Property } from './src/types';

import HomeScreen from './src/screens/HomeScreen';
import PropertyListScreen from './src/screens/PropertyListScreen';
import PropertyDetailScreen from './src/screens/PropertyDetailScreen';
import BookingScreen from './src/screens/BookingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

type RootStackParamList = {
  MainTabs: undefined;
  PropertyList: { filter?: string } | undefined;
  PropertyDetail: { property: Property };
  Booking: { property: Property };
  Auth: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Search" component={PropertyListScreen} options={{ tabBarLabel: 'Recherche' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: 'Favoris' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="PropertyList" component={PropertyListScreen} />
          <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
