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

export interface WordOfTheDayCardProps {
  word: DictionaryWord;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({
  word,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  const categoryInfo = word.category
    ? CATEGORIES.find((c) => c.id === word.category)
    : null;

  const handleFavoritePress = (e: GestureResponderEvent) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    onToggleFavorite();
  };

  return (
    <View style={styles.container}>
      {/* Top Banner Tag & Actions */}
      <View style={styles.badgeRow}>
        <View style={styles.spotlightBadge}>
          <Ionicons name="sparkles" size={14} color={Colors.accent} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>GÜNÜN KELİMESİ</Text>
        </View>

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
            accessibilityHint="Günün kelimesini favorilere ekler veya çıkarır"
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? Colors.heart : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Clickable Card Body */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`Günün kelimesi: ${word.word}, anlamı: ${word.meaning}`}
        accessibilityHint="Günün kelimesinin detaylarını görüntülemek için dokunun"
        style={styles.bodyTouchable}
      >
        {/* Main Word Title & Category */}
        <View style={styles.wordSection}>
          <Text style={styles.wordText} numberOfLines={1}>
            {word.word}
          </Text>

          {categoryInfo ? (
            <View style={styles.categoryBadge}>
              <Ionicons
                name={(categoryInfo.iconName as IconName) || 'pricetag-outline'}
                size={13}
                color={Colors.primary}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryLabel}>{categoryInfo.label}</Text>
            </View>
          ) : null}
        </View>

        {/* Meaning */}
        <Text style={styles.meaningText} numberOfLines={3}>
          {word.meaning}
        </Text>

        {/* Example Quote */}
        {word.example_sentence ? (
          <View style={styles.exampleContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color={Colors.accent}
              style={styles.quoteIcon}
            />
            <Text style={styles.exampleText} numberOfLines={3}>
              "{word.example_sentence}"
            </Text>
          </View>
        ) : null}

        {/* Footer navigation cue */}
        <View style={styles.footerRow}>
          <Text style={styles.footerActionText}>Detaylı İncele</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg, // 16px
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    ...Shadows.floating,
    marginVertical: Spacing.sm,
  },
  bodyTouchable: {
    marginTop: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  badgeIcon: {
    marginRight: 5,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    width: Spacing.minTouchTarget, // 44px
    height: Spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  wordSection: {
    marginBottom: Spacing.sm,
  },
  wordText: {
    fontSize: Typography.fontSize.title,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primaryDark,
    letterSpacing: -0.4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginTop: Spacing.xs,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primaryDark,
  },
  meaningText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: 23,
    marginBottom: Spacing.md,
  },
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md, // 12px
    marginBottom: Spacing.md,
  },
  quoteIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  exampleText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Spacing.xs,
  },
  footerActionText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    marginRight: 4,
  },
});
