#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized production build...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  console.log('✅ Previous builds cleaned\n');
} catch (error) {
  console.log('⚠️  No previous builds to clean\n');
}

// Step 2: Type checking
console.log('🔍 Running type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.error('❌ Type check failed');
  process.exit(1);
}

// Step 3: Linting
console.log('🔧 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.error('❌ Linting failed');
  process.exit(1);
}

// Step 4: Run tests
console.log('🧪 Running tests...');
try {
  execSync('npm run test', { stdio: 'inherit' });
  console.log('✅ Tests passed\n');
} catch (error) {
  console.error('❌ Tests failed');
  process.exit(1);
}

// Step 5: Production build
console.log('🏗️  Building for production...');
try {
  execSync('npm run build:production', { stdio: 'inherit' });
  console.log('✅ Production build completed\n');
} catch (error) {
  console.error('❌ Production build failed');
  process.exit(1);
}

// Step 6: Bundle size check
console.log('📦 Checking bundle size...');
try {
  execSync('npm run bundlesize', { stdio: 'inherit' });
  console.log('✅ Bundle size check passed\n');
} catch (error) {
  console.error('❌ Bundle size check failed');
  process.exit(1);
}

// Step 7: Generate build report
console.log('📊 Generating build report...');
const buildDir = '.next';
const buildInfo = {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  buildSize: getBuildSize(buildDir),
};

fs.writeFileSync('build-report.json', JSON.stringify(buildInfo, null, 2));
console.log('✅ Build report generated\n');

console.log('🎉 Optimized production build completed successfully!');
console.log('📋 Build Summary:');
console.log(`   - Build time: ${buildInfo.timestamp}`);
console.log(`   - Node version: ${buildInfo.nodeVersion}`);
console.log(`   - Build size: ${buildInfo.buildSize}`);

function getBuildSize(dir) {
  try {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(dir);
      let totalSize = 0;
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStats = fs.statSync(filePath);
        if (fileStats.isDirectory()) {
          totalSize += parseInt(getBuildSize(filePath).replace(/[^\d]/g, ''));
        } else {
          totalSize += fileStats.size;
        }
      });
      return `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
    }
    return `${(stats.size / 1024 / 1024).toFixed(2)} MB`;
  } catch (error) {
    return 'Unknown';
  }
}