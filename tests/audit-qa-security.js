const fs = require('fs');
const path = require('path');

const srcDirs = ['app', 'components', 'hooks', 'constants', 'types', 'data'];
const projectRoot = path.join(__dirname, '..');

let filesScanned = 0;
let hardcodedSecrets = [];
let rawSqlDetected = [];
let unhandledExceptions = [];
let touchTargetAudits = [];
let accessibilityLabels = [];

function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|json)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  filesScanned++;
  const relPath = path.relative(projectRoot, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Security Heuristics: Hardcoded Secrets
  const secretPatterns = [
    /(?:api_?key|auth_?token|secret_?key|private_?key|password|jwt_secret)\s*[:=]\s*['"`][A-Za-z0-9_\-\.]{16,}['"`]/i,
    /bearer\s+[A-Za-z0-9_\-\.]{20,}/i,
    /-----BEGIN (?:RSA )?PRIVATE KEY-----/
  ];

  secretPatterns.forEach((pat) => {
    if (pat.test(content)) {
      hardcodedSecrets.push({ file: relPath, match: content.match(pat)[0] });
    }
  });

  // 2. Security Heuristics: Raw SQL Injection
  const sqlPatterns = [
    /SELECT\s+.+\s+FROM\s+/i,
    /INSERT\s+INTO\s+/i,
    /UPDATE\s+.+\s+SET\s+/i,
    /DELETE\s+FROM\s+/i,
    /DROP\s+TABLE/i
  ];
  sqlPatterns.forEach((pat) => {
    if (pat.test(content)) {
      rawSqlDetected.push({ file: relPath, pattern: pat.toString() });
    }
  });

  // 3. Exception Handling Check (AsyncStorage / Speech / Network)
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    if (content.includes('AsyncStorage.') && !content.includes('try') && !content.includes('.catch(')) {
      unhandledExceptions.push({ file: relPath, reason: 'AsyncStorage operation without try/catch' });
    }
    if (content.includes('Speech.speak') && !content.includes('try') && !content.includes('.catch(')) {
      unhandledExceptions.push({ file: relPath, reason: 'Speech.speak without exception handling' });
    }

    // 4. Accessibility Checks
    const pressableMatches = content.match(/<(TouchableOpacity|Pressable|TouchableHighlight)[^>]*>/g) || [];
    pressableMatches.forEach((tag) => {
      const hasA11y = /accessibilityLabel|accessibilityRole|aria-label/.test(tag);
      accessibilityLabels.push({
        file: relPath,
        tag: tag.substring(0, 60),
        hasA11y
      });
    });
  }
}

srcDirs.forEach((dir) => {
  const fullDir = path.join(projectRoot, dir);
  if (fs.existsSync(fullDir)) {
    scanDirectory(fullDir);
  }
});

console.log('--- QA & Security Audit Results ---');
console.log(`Files Scanned: ${filesScanned}`);
console.log(`Hardcoded Secrets Found: ${hardcodedSecrets.length}`);
console.log(`Raw SQL Detected: ${rawSqlDetected.length}`);
console.log(`Unhandled Async Exceptions Detected: ${unhandledExceptions.length}`);
console.log(`Interactive Elements Scanned: ${accessibilityLabels.length}`);
const accessibleCount = accessibilityLabels.filter(a => a.hasA11y).length;
console.log(`Interactive Elements with A11y attributes: ${accessibleCount} / ${accessibilityLabels.length}`);

if (hardcodedSecrets.length > 0) {
  console.log('Hardcoded Secrets:', hardcodedSecrets);
}
if (rawSqlDetected.length > 0) {
  console.log('Raw SQL Queries:', rawSqlDetected);
}
if (unhandledExceptions.length > 0) {
  console.log('Unhandled Exceptions:', unhandledExceptions);
}
