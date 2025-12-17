#!/usr/bin/env node
import { globSync } from 'fs';
import { transformFileSync } from '@babel/core';
import { writeFileSync } from 'fs';

// Find all .src.js files in test directory
const srcFiles = globSync('test-next/*.src.js');

console.log(`Transpiling ${srcFiles.length} decorator source files...`);

for (const srcFile of srcFiles) {
  // Output file: remove .src from the filename
  const outFile = srcFile.replace(/\.src\.js$/, '.js');

  // Transpile the file
  const result = transformFileSync(srcFile, {
    sourceMaps: 'inline',
    // Use the .babelrc.json config
  });

  // Write the transpiled output
  writeFileSync(outFile, result.code);
  console.log(`  ${srcFile} → ${outFile}`);
}

console.log('✓ Transpilation complete');
