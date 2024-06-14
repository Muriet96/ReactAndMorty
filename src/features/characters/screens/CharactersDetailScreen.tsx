import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Button, 
  Card, 
  Text, 
  useTheme, 
  Surface
} from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {  RootState } from '../../../store/types';
import { toggleFavorite } from '../charactersSlice';
import { StackScreenProps } from '@react-navigation/stack';
import { CharactersStackParamList } from '../../../navigation/types';
import { getStatusEmoji } from '../../../utils/characterUtils';

type Props = StackScreenProps<CharactersStackParamList, 'CharactersDetail'>;
type CharactersDetailScreenRouteProp = RouteProp<CharactersStackParamList, 'CharactersDetail'>;

/**
 * Displays the detailScreens of a selected characters item, including its image, title, publication date, and content.
 * Allows users to mark the characters item as a favorite or remove it from favorites.
 * Handles the case where the characters item is not found and provides a button to navigate back.
 *
 * @component
 * @param {Props} props - The navigation props for the screen.
 * @returns {JSX.Element} The rendered characters detailScreen screen.
 *
 * @remarks
 * - Uses Redux to access the list of characters and favorites.
 * - Uses i18next for translations.
 * - Uses React Native Paper components for UI.
 * - Handles favorite toggling via Redux action.
 * - Displays a not-found message if the characters item does not exist.
 */
const CharactersDetailScreenScreen = ({ navigation } : Props) => {
  const route = useRoute<CharactersDetailScreenRouteProp>();
  const { id } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation('characters');
  
  const { characters, favorites } = useSelector((state: RootState) => state.characters);

  const charactersItem = useMemo(
    () => characters.find(item => item.id === id),
    [characters, id]
  );

  const isFavorite = useMemo(
    () => favorites.some(item => item === id),
    [favorites, id]
  );

  if (!charactersItem) {
    return (
      <Surface style={styles.center}>
        <Text variant="titleMedium" testID="not-found-message">{t('errors.charactersNotFound')}</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
          testID="go-back-button"
        >
          {t('actions.goBack')}
        </Button>
      </Surface>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(charactersItem.id));
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardWrapper}>
          <Card style={styles.card}>
            <Card.Cover 
              source={{ uri: charactersItem.image }} 
              style={styles.squareImage}
              resizeMode="cover"
            />
            <Card.Content style={styles.content}>
              <Text 
                variant="titleLarge" 
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                {charactersItem.name}
              </Text>
              <View style={styles.attributesList}>
                <View style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>{getStatusEmoji(charactersItem.status)} {t('detailScreen.status')}:</Text>
                  <Text variant='bodyMedium'>{charactersItem.status}</Text>
                </View>
                <View style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>🧬 {t('detailScreen.species')}:</Text>
                  <Text variant='bodyMedium'>{charactersItem.species}</Text>
                </View>
                <View style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>🌍 {t('detailScreen.origin')}:</Text>
                  <Text variant='bodyMedium'>{charactersItem.origin?.name}</Text>
                </View>
                <View style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>🎬 {t('detailScreen.appearances')}:</Text>
                  <Text variant='bodyMedium'>
                    {charactersItem.episode.length} {charactersItem.episode.length === 1
                      ? t('detailScreen.episode')
                      : t('detailScreen.episodes')
                    }
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button 
                mode="outlined" 
                onPress={handleToggleFavorite}
                icon={isFavorite ? "heart" : "heart-outline"}
                textColor={isFavorite ? theme.colors.error : theme.colors.primary}
                style={styles.favoriteButton}
                testID="favorite-toggle-button"
              >
                {isFavorite ? t('actions.removeFavorite') : t('actions.addFavorite')}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    padding: 16
},
  cardWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 8,
    elevation: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  squareImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  attributesList: {
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attributeLabel: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16
  },
  actions: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  favoriteButton: {
    borderWidth: 1.5,
  },
  button: {
    marginTop: 16,
  },
});

export default CharactersDetailScreenScreen;