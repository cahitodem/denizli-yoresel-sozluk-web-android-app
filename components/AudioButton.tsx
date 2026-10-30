import React, { useState, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

export interface AudioButtonProps {
  word: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  word,
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      // Cleanup speech on unmount
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        } else {
          Speech.stop();
        }
      } catch {
        // Silently catch cleanup error
      }
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (!word) return;

    if (isPlaying) {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        } else {
          await Speech.stop();
        }
      } catch {
        // Ignore stop error
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        Speech.speak(word, {
          language: 'tr-TR',
          pitch: 1.0,
          rate: 0.9,
          onDone: () => setIsPlaying(false),
          onStopped: () => setIsPlaying(false),
          onError: () => setIsPlaying(false),
        });
      }
    } catch (error) {
      console.warn('Speech playback failed:', error);
      setIsPlaying(false);
    }
  }, [word, isPlaying]);

  const sizeConfig = {
    sm: {
      buttonSize: Spacing.minTouchTarget, // 44px
      innerSize: 34,
      iconSize: 18,
    },
    md: {
      buttonSize: 44,
      innerSize: 40,
      iconSize: 22,
    },
    lg: {
      buttonSize: 52,
      innerSize: 48,
      iconSize: 26,
    },
  }[size];

  const containerStyle: ViewStyle = {
    width: sizeConfig.buttonSize,
    height: sizeConfig.buttonSize,
    minWidth: Spacing.minTouchTarget,
    minHeight: Spacing.minTouchTarget,
  };

  return (
    <TouchableOpacity
      onPress={handlePlay}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? `${word} seslendirmesini durdur` : `${word} kelimesini seslendir`}
      accessibilityHint="Denizli şivesi kelimesinin Türkçe telaffuzunu dinleyin"
      accessibilityState={{ busy: isPlaying }}
      style={[
        styles.buttonBase,
        containerStyle,
        isPlaying ? styles.buttonPlaying : styles.buttonIdle,
      ]}
    >
      <Ionicons
        name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
        size={sizeConfig.iconSize}
        color={isPlaying ? Colors.audioActive : Colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
  },
  buttonIdle: {
    backgroundColor: Colors.primarySubtle,
  },
  buttonPlaying: {
    backgroundColor: Colors.audioBackground,
    borderWidth: 1.5,
    borderColor: Colors.audioActive,
  },
});
