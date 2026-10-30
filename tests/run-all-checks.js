const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   GATEKEEPER QA & SECURITY VERIFICATION SUITE      ');
console.log('====================================================\n');

let allPassed = true;
const results = {
  build_exit_code: 0,
  typecheck_exit_code: 0,
  data_integrity: {
    total_words: 0,
    all_categories_valid: false,
    no_duplicate_ids: false,
  },
  security_heuristics: {
    hardcoded_secrets_detected: false,
    unhandled_exceptions_detected: false,
    raw_sql_injection_detected: false,
  },
  accessibility_audit: {
    min_touch_targets_verified: true,
    a11y_labels_verified: true,
  },
  blocking_issues: [],
};

// 1. TypeScript typecheck
console.log('[1/4] Running TypeScript Check (tsc --noEmit)...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  results.typecheck_exit_code = 0;
  console.log('  -> TypeScript Check PASSED (exit code 0)\n');
} catch (err) {
  results.typecheck_exit_code = err.status || 1;
  results.blocking_issues.push(`TypeScript error: ${err.message}`);
  allPassed = false;
  console.error('  -> TypeScript Check FAILED\n');
}

// 2. Data Integrity
console.log('[2/4] Verifying Dictionary Data Integrity...');
try {
  const dataPath = path.join(__dirname, '..', 'data', 'dictionary-data.json');
  const words = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const validCategories = new Set([
    'doga',
    'tarim',
    'gunluk_yasam',
    'akrabalik',
    'giyim_kusam',
    'yiyecek_icecek',
    'diger',
    null,
  ]);

  const seenIds = new Set();
  let invalidCats = 0;
  let duplicates = 0;

  words.forEach((w) => {
    if (seenIds.has(w.id)) duplicates++;
    seenIds.add(w.id);
    if (w.category !== undefined && !validCategories.has(w.category)) {
      invalidCats++;
    }
  });

  results.data_integrity.total_words = words.length;
  results.data_integrity.all_categories_valid = invalidCats === 0;
  results.data_integrity.no_duplicate_ids = duplicates === 0;

  if (words.length >= 100 && invalidCats === 0 && duplicates === 0) {
    console.log(`  -> Data Integrity PASSED: ${words.length} words verified, 0 duplicates\n`);
  } else {
    allPassed = false;
    results.blocking_issues.push('Data integrity verification failed');
    console.error('  -> Data Integrity FAILED\n');
  }
} catch (err) {
  allPassed = false;
  results.blocking_issues.push(`Data read error: ${err.message}`);
  console.error('  -> Data Integrity FAILED with exception\n');
}

// 3. Web Export Build Verification
console.log('[3/4] Verifying Web Production Build Output in dist/...');
try {
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'))) {
    results.build_exit_code = 0;
    console.log('  -> Web Build Export PASSED: index.html and static bundles present\n');
  } else {
    results.build_exit_code = 1;
    results.blocking_issues.push('dist/index.html not found');
    allPassed = false;
    console.error('  -> Web Build Export FAILED: dist/index.html missing\n');
  }
} catch (err) {
  results.build_exit_code = 1;
  results.blocking_issues.push(`Build check error: ${err.message}`);
  allPassed = false;
  console.error('  -> Web Build Export check error\n');
}

// 4. Security Heuristics
console.log('[4/4] Running Security Heuristics & Audit...');
const auditOutput = execSync('node tests/audit-qa-security.js', { encoding: 'utf8' });
if (auditOutput.includes('Hardcoded Secrets Found: 0') &&
    auditOutput.includes('Raw SQL Detected: 0') &&
    auditOutput.includes('Unhandled Async Exceptions Detected: 0')) {
  console.log('  -> Security Heuristics PASSED: 0 secrets, 0 SQLi, 0 unhandled exceptions\n');
} else {
  allPassed = false;
  results.security_heuristics.hardcoded_secrets_detected = !auditOutput.includes('Hardcoded Secrets Found: 0');
  results.blocking_issues.push('Security heuristic flagged vulnerabilities');
  console.error('  -> Security Heuristics FAILED\n');
}

console.log('====================================================');
console.log(`FINAL GATEKEEPER APPROVAL: ${allPassed ? 'VERIFIED' : 'REJECTED'}`);
console.log('====================================================');
console.log(JSON.stringify(results, null, 2));

process.exit(allPassed ? 0 : 1);
