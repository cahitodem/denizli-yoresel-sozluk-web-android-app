import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Denizli şivesinde kelime veya anlam ara...',
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  return (
    <View
      style={[
        styles.container,
        isFocused ? styles.containerFocused : styles.containerBlurred,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={isFocused ? Colors.primary : Colors.textSecondary}
        />
      </View>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityRole="search"
        accessibilityLabel="Kelime arama kutusu"
        accessibilityHint="Aramak istediğiniz Denizli yöresel kelimesini veya Türkçe anlamını yazın"
      />

      {value.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.7}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          accessibilityHint="Arama kutusundaki yazıyı temizler"
        >
          <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, // 16px
    borderWidth: 1.5,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    ...Shadows.soft,
  },
  containerBlurred: {
    borderColor: Colors.cardBorder,
  },
  containerFocused: {
    borderColor: Colors.primary,
    ...Shadows.medium,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 0,
  },
  clearButton: {
    width: Spacing.minTouchTarget, // 44px minimum touch target
    height: Spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.xs,
  },
});
