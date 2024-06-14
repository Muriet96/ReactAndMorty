import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {ActivityIndicator, Text, Searchbar, useTheme, Button, IconButton, Surface} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useCharacters } from '../hooks/useCharacters';
import CharactersCard from '../components/CharacterCard';
import { StackScreenProps } from '@react-navigation/stack';
import { CharactersStackParamList } from '../../../navigation/types';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFavorites } from '../charactersSlice';
import {RootState} from '../../../store/types';
import { usePageState } from '../hooks/usePageState';

type Props = StackScreenProps<CharactersStackParamList, 'CharactersList'>;

/**
 * Displays a list of characters articles with search and favorites filtering functionality.
 *
 * This screen fetches characters data, allows users to search articles by title or content,
 * and toggle the display of favorite articles. It handles loading and error states,
 * and persists favorite articles using AsyncStorage.
 *
 * @component
 * @param {Props} props - The navigation props for the screen.
 * @returns {JSX.Element} The rendered characters list screen.
 *
 * @example
 * <CharactersListScreen navigation={navigation} />
 *
 * @remarks
 * - Uses `useCharacters` hook for fetching characters data.
 * - Integrates with Redux for managing favorites.
 * - Supports localization via `useTranslation`.
 * - Displays loading and error states with retry capability.
 */
const CharactersListScreen = ({ navigation, route }: Props) => {
  const showFavorites = route?.params?.showFavorites ?? false;
  const theme = useTheme();
  const { t } = useTranslation('characters');
  const [page, setPage] = usePageState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, error, refetch, data } = useCharacters(page, showFavorites);
  const { favorites, characters } = useSelector((state: RootState) => state.characters);
  const dispatch = useDispatch();


  const filteredCharacters = useMemo(() => {
    if (!characters) return [];
    return characters.filter(item => {
      if (showFavorites && !favorites.includes(item.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [characters, searchQuery, showFavorites, favorites]);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) {
        dispatch(loadFavorites(JSON.parse(data)));
      }
    });
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!showFavorites && data?.info?.next) {
      setPage((prev) => prev + 1);
    }
  };

  let emptyMessage = t('common.emptyList');
  if (showFavorites) {
    emptyMessage = t('listScreen.emptyFavorites');
  } else if (searchQuery) {
    emptyMessage = t('listScreen.emptyResults');
  }

  if (isLoading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" testID="loading-indicator" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }} testID="error-message">
          {t('errors.loadCharacters')}
        </Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          style={styles.retryButton}
          testID="retry-button"
        >
          {t('common.retry')}
        </Button>
      </View>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.filterBar}>
        <Searchbar
          placeholder={t('listScreen.searchPlaceholder')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          theme={{ colors: { elevation: { level3: theme.colors.surfaceVariant } } }}
        />
      </View>

      <FlatList
      testID="characters-flatlist"
        data={filteredCharacters}
        renderItem={({ item }) => (
          <CharactersCard
            item={item}
            onPress={() => navigation.navigate('CharactersDetail', { id: item.id, title: item.name })}
          />
        )
        }
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText} testID='empty-list-message'>
            {emptyMessage}
          </Text>
        }
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          !showFavorites && isLoading && page > 1 ? (
            <View style={styles.listFooter}>
              <ActivityIndicator animating={true} size="small" testID="loading-more-indicator" />
            </View>
          ) : null
        }
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 2,
    flex: 1
  },
  listContent: {
    paddingBottom: 16,
  },
  listFooter: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
  retryButton: {
    marginTop: 16,
  },
});

export default CharactersListScreen;