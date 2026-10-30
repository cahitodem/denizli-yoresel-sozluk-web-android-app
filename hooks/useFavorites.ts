import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FAVORITES_STORAGE_KEY = '@denizli_sozluk_favorites';

export function useFavorites(): {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  isLoading: boolean;
} {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavoriteIds(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load favorites from AsyncStorage', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const isFavorite = useCallback(
    (id: string): boolean => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (id: string): Promise<void> => {
      try {
        const exists = favoriteIds.includes(id);
        const updatedFavorites = exists
          ? favoriteIds.filter((favId) => favId !== id)
          : [...favoriteIds, id];

        setFavoriteIds(updatedFavorites);
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
      } catch (error) {
        console.error('Failed to persist favorites to AsyncStorage', error);
      }
    },
    [favoriteIds]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoading,
  };
}
