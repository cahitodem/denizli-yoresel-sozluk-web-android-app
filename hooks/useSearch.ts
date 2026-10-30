import { useState, useEffect, useMemo } from 'react';
import type { DictionaryWord, CategoryType } from '../types/dictionary';

function normalizeTurkish(text: string | null | undefined): string {
  if (!text) return '';
  return text.toLocaleLowerCase('tr-TR').trim();
}

export function useSearch(
  words: DictionaryWord[],
  initialCategory?: CategoryType | 'hepsi'
): {
  query: string;
  setQuery: (q: string) => void;
  selectedCategory: CategoryType | 'hepsi';
  setSelectedCategory: (c: CategoryType | 'hepsi') => void;
  filteredWords: DictionaryWord[];
  isSearching: boolean;
} {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'hepsi'>(
    initialCategory ?? 'hepsi'
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredWords = useMemo(() => {
    const normalizedQuery = normalizeTurkish(debouncedQuery);

    return words.filter((item) => {
      // Category filter: 'hepsi' matches all categories
      if (selectedCategory !== 'hepsi' && item.category !== selectedCategory) {
        return false;
      }

      // Query filter: empty query returns all words matching category
      if (!normalizedQuery) {
        return true;
      }

      const wordMatch = normalizeTurkish(item.word).includes(normalizedQuery);
      const meaningMatch = normalizeTurkish(item.meaning).includes(normalizedQuery);
      const exampleMatch = normalizeTurkish(item.example_sentence).includes(normalizedQuery);

      const pronunciationMatch = (item as unknown as { pronunciation?: string }).pronunciation
        ? normalizeTurkish((item as unknown as { pronunciation?: string }).pronunciation).includes(normalizedQuery)
        : false;

      return wordMatch || meaningMatch || exampleMatch || pronunciationMatch;
    });
  }, [words, debouncedQuery, selectedCategory]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredWords,
    isSearching,
  };
}
