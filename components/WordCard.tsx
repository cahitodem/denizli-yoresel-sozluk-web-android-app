import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DictionaryWord } from '../types/dictionary';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  CATEGORIES,
} from '../constants/theme';
import { AudioButton } from './AudioButton';

export interface WordCardProps {
  word: DictionaryWord;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  const categoryInfo = word.category
    ? CATEGORIES.find((c) => c.id === word.category)
    : null;

  const handleFavoritePress = (e: GestureResponderEvent) => {
    // Stop bubbling to card onPress
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    onToggleFavorite();
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${word.word}, anlamı: ${word.meaning}`}
          accessibilityHint="Kelimenin detaylarını görmek için dokunun"
          style={styles.titleContainer}
        >
          <Text style={styles.wordTitle} numberOfLines={1}>
            {word.word}
          </Text>
          {categoryInfo ? (
            <View style={styles.categoryBadge}>
              <Ionicons
                name={(categoryInfo.iconName as IconName) || 'pricetag-outline'}
                size={12}
                color={Colors.primary}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {categoryInfo.label}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <AudioButton word={word.word} size="sm" />

          <TouchableOpacity
            onPress={handleFavoritePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? `${word.word} kelimesini favorilerden çıkar`
                : `${word.word} kelimesini favorilere ekle`
            }
            accessibilityHint="Favori durumunu değiştirir"
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? Colors.heart : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`${word.word} detaylarını görüntüle`}
        accessibilityHint="Kelimenin detay sayfasına yönlendirir"
        style={styles.bodyTouchable}
      >
        <Text style={styles.meaningText} numberOfLines={3}>
          {word.meaning}
        </Text>

        {word.example_sentence ? (
          <View style={styles.exampleContainer}>
            <Text style={styles.examplePrefix}>Örnek:</Text>
            <Text style={styles.exampleText} numberOfLines={2}>
              "{word.example_sentence}"
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg, // 16px
    padding: Spacing.lg,
    marginVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.medium, // Android elevation: 4, iOS shadow
  },
  bodyTouchable: {
    marginTop: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  wordTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: Spacing.xs,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primaryDark,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    width: Spacing.minTouchTarget, // 44px
    height: Spacing.minTouchTarget, // 44px
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  meaningText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  exampleContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  examplePrefix: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    marginRight: Spacing.xs,
  },
  exampleText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
