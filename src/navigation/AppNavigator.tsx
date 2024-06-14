import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CharactersListScreen from '@features/characters/screens/CharactersListScreen';
import CharactersDetailScreen from '@features/characters/screens/CharactersDetailScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CharactersStackParamList, RootTabParamList } from './types';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const CharactersStack = createStackNavigator<CharactersStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function CharactersStackNavigator({ route }: { route?: any }) {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const showFavorites = route?.params?.showFavorites ?? false;

  return (
    <CharactersStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <CharactersStack.Screen
        name="CharactersList"
        component={CharactersListScreen}
        options={{ title: t('latestCharacters') }}
        initialParams={{ showFavorites }}
      />
      <CharactersStack.Screen
        name="CharactersDetail"
        component={CharactersDetailScreen}
        options={({ route }) => ({
          title: route.params?.title ?? t('detail'),
          headerBackButtonDisplayMode: 'minimal',
        })}
      />
    </CharactersStack.Navigator>
  );
}

function AppNavigator() {
  const theme = useTheme();
  const { t } = useTranslation('common');
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Characters') {
            return <MaterialCommunityIcons name="account-group" color={color} size={size} />;
          }
          if (route.name === 'Favorites') {
            return <MaterialCommunityIcons name="heart" color={color} size={size} />;
          }
          return null;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen
        name="Characters"
        component={CharactersStackNavigator}
        options={{ title: t('characters'), headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={CharactersStackNavigator}
        options={{ title: t('favorites'), headerShown: false }}
        initialParams={{ showFavorites: true }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;