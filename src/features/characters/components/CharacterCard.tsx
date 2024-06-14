import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, Button, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Character } from '../types';
import { useCharactersActions } from '../hooks/useCharactersActions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/types';

interface CharactersCardProps {
  item: Character;
  onPress: () => void;
}

/**
 * Renders a characters card component displaying an image, title, publication date, content snippet,
 * and actions for reading more or saving the characters item as a favorite.
 *
 * @param {CharactersCardProps} props - The props for the CharactersCard component.
 * @param {CharactersItem} props.item - The characters item to display in the card.
 * @param {() => void} props.onPress - Callback invoked when the "Read More" button is pressed.
 *
 * @returns {JSX.Element} The rendered CharactersCard component.
 *
 * @remarks
 * - Uses theming from the current context.
 * - Integrates with translation and Redux state for favorites.
 * - Allows toggling the favorite status of the characters item.
 */
const CharactersCard = ({ item, onPress }: CharactersCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation('characters');
  const { toggleFavorite } = useCharactersActions();
  const isFavorite = useSelector(React.useMemo(
    () => (state: RootState) => state.characters.favorites.some(fav => fav === item.id),
    [item.id]
  )
);

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      testID="character-card"
    >
      <View style={styles.cardContentWrapper}>
        <View style={styles.favoriteCircleCard}>
          <IconButton
            testID="favorites-toggle"
            icon={isFavorite ? "heart" : "heart-outline"}
            mode="contained"
            onPress={() => toggleFavorite(item.id)}
            size={20}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            style={{ margin: 0 }} 
            accessibilityLabel={isFavorite ? "heart" : "heart-outline"}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Card.Cover 
              source={{ uri: item.image }} 
              style={styles.squareImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 1,
    borderRadius: 12,
    overflow: 'visible',
  },
  cardContentWrapper: {
    position: 'relative',
  },
  favoriteCircleCard: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  favoriteButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    paddingRight: 32
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default CharactersCard;