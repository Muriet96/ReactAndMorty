import { NavigatorScreenParams } from '@react-navigation/native';

export type CharactersStackParamList = {
  CharactersList: { showFavorites?: boolean };
  CharactersDetail: { title?: string, id: number };
};

export type RootTabParamList = {
  Characters: NavigatorScreenParams<CharactersStackParamList>;
  Favorites: { showFavorites?: boolean };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}