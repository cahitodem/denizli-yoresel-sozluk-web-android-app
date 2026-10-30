const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const componentsDir = path.join(projectRoot, 'components');
const appDir = path.join(projectRoot, 'app');

function inspectDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      inspectDir(full);
    } else if (/\.tsx$/.test(f.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/TouchableOpacity|Pressable/.test(line) && !line.includes('import')) {
          console.log(`${path.relative(projectRoot, full)}:${i + 1} -> ${line.trim()}`);
        }
      });
    }
  }
}

console.log('--- Scanning Interactive Elements ---');
inspectDir(componentsDir);
inspectDir(appDir);
