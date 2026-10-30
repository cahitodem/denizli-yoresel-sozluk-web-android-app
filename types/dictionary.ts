export type CategoryType =
  | 'doga'
  | 'tarim'
  | 'gunluk_yasam'
  | 'akrabalik'
  | 'giyim_kusam'
  | 'yiyecek_icecek'
  | 'diger';

export interface DictionaryWord {
  id: string;
  word: string;
  meaning: string;
  example_sentence: string | null;
  category: CategoryType | null;
  audio_url: string | null;
}

export interface CategoryInfo {
  id: CategoryType | 'hepsi';
  label: string;
  iconName: string;
}

export type SortOrder = 'alphabetical_asc' | 'alphabetical_desc' | 'random';

export interface FilterOptions {
  searchQuery: string;
  selectedCategory: CategoryType | 'hepsi';
  favoritesOnly: boolean;
  sortBy: SortOrder;
}
