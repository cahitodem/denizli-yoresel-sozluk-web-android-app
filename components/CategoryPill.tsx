import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryType } from '../types/dictionary';
import { Colors, Spacing, Typography, BorderRadius, CATEGORIES } from '../constants/theme';

export interface CategoryPillProps {
  category: CategoryType | 'hepsi';
  isSelected: boolean;
  onPress: () => void;
  count?: number;
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  isSelected,
  onPress,
  count,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    label: category,
    iconName: 'pricetag-outline',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${categoryInfo.label} kategorisi${
        count !== undefined ? `, ${count} kelime` : ''
      }${isSelected ? ', seçili' : ''}`}
      style={[
        styles.pillContainer,
        isSelected ? styles.pillSelected : styles.pillUnselected,
      ]}
    >
      <Ionicons
        name={(categoryInfo.iconName as IconName) || 'pricetag-outline'}
        size={16}
        color={isSelected ? Colors.textInverse : Colors.textSecondary}
        style={styles.icon}
      />
      
      <Text
        style={[
          styles.labelText,
          isSelected ? styles.textSelected : styles.textUnselected,
        ]}
      >
        {categoryInfo.label}
      </Text>

      {typeof count === 'number' ? (
        <View
          style={[
            styles.countBadge,
            isSelected ? styles.countBadgeSelected : styles.countBadgeUnselected,
          ]}
        >
          <Text
            style={[
              styles.countText,
              isSelected ? styles.countTextSelected : styles.countTextUnselected,
            ]}
          >
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Spacing.minTouchTarget, // 44px accessibility standard
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.sm,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  pillUnselected: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  icon: {
    marginRight: Spacing.xs + 2,
  },
  labelText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  textSelected: {
    color: Colors.textInverse,
  },
  textUnselected: {
    color: Colors.textSecondary,
  },
  countBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countBadgeUnselected: {
    backgroundColor: Colors.surfaceVariant,
  },
  countText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  countTextSelected: {
    color: Colors.textInverse,
  },
  countTextUnselected: {
    color: Colors.textSecondary,
  },
});
