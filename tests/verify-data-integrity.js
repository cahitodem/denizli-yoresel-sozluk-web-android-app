const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'dictionary-data.json');
const rawData = fs.readFileSync(dataFilePath, 'utf8');
const words = JSON.parse(rawData);

console.log(`Checking data integrity for ${words.length} entries...`);

const validCategories = new Set([
  'doga',
  'tarim',
  'gunluk_yasam',
  'akrabalik',
  'giyim_kusam',
  'yiyecek_icecek',
  'diger',
  null
]);

let errors = [];
const seenIds = new Set();
const seenWords = new Set();

if (!Array.isArray(words)) {
  errors.push('Root JSON is not an array.');
}

if (words.length < 100) {
  errors.push(`Expected at least 100 words, got ${words.length}.`);
}

words.forEach((item, index) => {
  if (!item.id || typeof item.id !== 'string') {
    errors.push(`Item at index ${index} missing valid id: ${JSON.stringify(item)}`);
  } else if (seenIds.has(item.id)) {
    errors.push(`Duplicate id detected: ${item.id}`);
  } else {
    seenIds.add(item.id);
  }

  if (!item.word || typeof item.word !== 'string' || item.word.trim().length === 0) {
    errors.push(`Item ${item.id || index} missing or empty word`);
  }

  if (!item.meaning || typeof item.meaning !== 'string' || item.meaning.trim().length === 0) {
    errors.push(`Item ${item.id || index} missing or empty meaning`);
  }

  if (item.category !== undefined && !validCategories.has(item.category)) {
    errors.push(`Item ${item.id} has invalid category: ${item.category}`);
  }

  // Audio URL check
  if (item.audio_url !== undefined && item.audio_url !== null && typeof item.audio_url !== 'string') {
    errors.push(`Item ${item.id} has invalid audio_url type`);
  }
});

const categoryCounts = {};
words.forEach(w => {
  const cat = w.category || 'null';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

console.log('Category breakdown:', categoryCounts);

if (errors.length > 0) {
  console.error(`Verification FAILED with ${errors.length} errors:`);
  errors.slice(0, 10).forEach(e => console.error('-', e));
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${words.length} words verified!`);
  console.log(`- Total words: ${words.length}`);
  console.log(`- Unique IDs: ${seenIds.size}`);
  console.log(`- All categories valid: true`);
  console.log(`- No duplicate IDs: true`);
  process.exit(0);
}
