import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../charactersSlice';
import CharactersDetailScreen from '../screens/CharactersDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n/config';
import { getStatusEmoji } from '../../../utils/characterUtils';

const Stack = createStackNavigator();

const mockCharactersItem = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://example.com/image.jpg',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  episode: ['ep1', 'ep2'],
  url: '',
  created: '',
};

const createTestStore = (overrides = {}) => {
  return configureStore({
    reducer: {
      // @ts-ignore
      characters: charactersReducer,
    },
    preloadedState: {
      characters: {
        characters: [mockCharactersItem],
        favorites: [],
        loading: false,
        error: null,
        searchQuery: '',
        ...overrides,
      },
    },
  });
};

const renderWithProviders = (store: any, params = { id: 1 }) => {
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="CharactersDetail"
              // @ts-ignore
              component={CharactersDetailScreen}
              initialParams={params}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  );
};

jest.mock('react-native-gesture-handler', () => {
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    GestureHandlerRootView: ({ children }: any) => children,
    Swipeable: ({ children }: any) => children,
    FlatList: jest.requireActual('react-native').FlatList,
    ScrollView: jest.requireActual('react-native').ScrollView,
    default: { install: jest.fn() },
  };
});

describe('CharactersDetailScreen', () => {
  it('should render characters details correctly', () => {
    const store = createTestStore();
    const { getByText } = renderWithProviders(store);

    expect(getByText('Add to favorites')).toBeTruthy();
    expect(getByText('Rick Sanchez')).toBeTruthy();
    expect(getByText(/Alive/)).toBeTruthy();
    expect(getByText(/Human/)).toBeTruthy();
    expect(getByText(/Earth \(C-137\)/)).toBeTruthy();
    expect(getByText(/2/)).toBeTruthy();
  });

  it('should toggle favorite when button is pressed', () => {
    const store = createTestStore();
    const { getByText } = renderWithProviders(store);

    const button = getByText('Add to favorites');
    fireEvent.press(button);

    expect(store.getState().characters.favorites).toContain(1);
  });

  it('should show "remove from favorites" if already favorite', () => {
    const store = createTestStore({ favorites: [1] });
    const { getByText } = renderWithProviders(store);

    expect(getByText('Remove from favorites')).toBeTruthy();

    fireEvent.press(getByText('Remove from favorites'));
    expect(store.getState().characters.favorites).not.toContain(1);
  });

  it('should show not found if characters does not exist', () => {
    const store = createTestStore({ characters: [] });
    const { getByTestId } = renderWithProviders(store);

    expect(getByTestId('not-found-message')).toBeTruthy();
    expect(getByTestId('go-back-button')).toBeTruthy();
  });

  it('should call navigation.goBack when go back button is pressed', () => {
    const store = createTestStore({ characters: [] });
    const mockGoBack = jest.fn();
    const navigation = { goBack: mockGoBack };

    const { getByTestId } = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="CharactersDetail"
                children={props => (
                  <CharactersDetailScreen
                    {...props}
                    navigation={navigation as any}
                    route={{
                      ...props.route,
                      params: { id: 1, title: 'Rick Sanchez' }
                    }}
                  />
                )}
                initialParams={{ id: 1, title: 'Rick Sanchez' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </I18nextProvider>
      </Provider>
    );

    fireEvent.press(getByTestId('go-back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should show correct pluralization for episodes', () => {
    const store = createTestStore({
      characters: [
        { ...mockCharactersItem, episode: ['ep1'] }
      ]
    });
    const { getByText } = renderWithProviders(store, { id: 1 });
    expect(getByText(/1 episode/)).toBeTruthy();
  });
});

describe('getStatusEmoji', () => {
  it('returns 🟢 for Alive', () => {
    expect(getStatusEmoji('Alive')).toBe('🟢');
  });
  it('returns 🔴 for Dead', () => {
    expect(getStatusEmoji('Dead')).toBe('🔴');
  });
  it('returns ⚪️ for unknown or any other status', () => {
    expect(getStatusEmoji('unknown')).toBe('⚪️');
    expect(getStatusEmoji('OtherStatus')).toBe('⚪️');
  });
});