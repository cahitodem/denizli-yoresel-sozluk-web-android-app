import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightAction,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="header"
    >
      <View style={styles.titleWrapper}>
        <View style={styles.titleRow}>
          <View style={styles.brandAccentBar} />
          <Text
            style={styles.titleText}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text style={styles.subtitleText} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightAction ? (
        <View style={styles.rightActionContainer}>
          {rightAction}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    minHeight: 56,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  titleText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textSecondary,
    marginTop: 2,
    paddingLeft: Spacing.sm + 4, // Align with title text past accent bar
  },
  rightActionContainer: {
    minWidth: Spacing.minTouchTarget,
    minHeight: Spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
