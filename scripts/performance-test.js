#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36 Chrome-Lighthouse',
  },
  audits: [
    'first-contentful-paint',
    'largest-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'total-blocking-time',
    'cumulative-layout-shift',
    'server-response-time',
    'interactive',
    'user-timings',
    'critical-request-chains',
    'redirects',
    'mainthread-work-breakdown',
    'bootup-time',
    'uses-optimized-images',
    'uses-webp-images',
    'uses-text-compression',
    'unused-css-rules',
    'unused-javascript',
    'modern-image-formats',
    'efficient-animated-content',
    'duplicated-javascript',
    'legacy-javascript',
    'preload-lcp-image',
    'total-byte-weight',
    'render-blocking-resources',
    'unminified-css',
    'unminified-javascript',
    'uses-long-cache-ttl',
    'uses-rel-preconnect',
    'uses-rel-preload',
    'font-display',
    'third-party-summary',
    'third-party-facades',
    'largest-contentful-paint-element',
    'layout-shift-elements',
    'uses-passive-event-listeners',
    'no-document-write',
    'dom-size',
  ],
  categories: {
    performance: {
      title: 'Performance',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 10 },
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'total-blocking-time', weight: 30 },
        { id: 'cumulative-layout-shift', weight: 25 },
        { id: 'speed-index', weight: 10 },
      ],
    },
  },
};

async function runPerformanceTest() {
  console.log('🚀 Starting performance test...\n');

  // Write lighthouse config
  const configPath = path.join(__dirname, '..', 'lighthouse-config.json');
  fs.writeFileSync(configPath, JSON.stringify(LIGHTHOUSE_CONFIG, null, 2));

  try {
    // Build the project
    console.log('📦 Building project...');
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Build completed\n');

    // Start the server
    console.log('🌐 Starting server...');
    const serverProcess = spawn('npm', ['run', 'start'], {
      stdio: 'pipe',
      detached: false,
    });

    // Wait for server to be ready
    await new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Ready')) {
          resolve();
        }
      });
      setTimeout(resolve, 5000); // Fallback timeout
    });

    console.log('✅ Server started\n');

    // Run Lighthouse audit
    console.log('🔍 Running Lighthouse audit...');
    const lighthouseArgs = [
      'http://localhost:3000',
      '--config-path=' + configPath,
      '--output=html',
      '--output=json',
      '--output-path=./lighthouse-report',
      '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
      '--quiet',
    ];

    const lighthouseResult = await runCommand('npx', ['lighthouse', ...lighthouseArgs]);
    console.log('✅ Lighthouse audit completed\n');

    // Parse results
    const reportPath = path.join(__dirname, '..', 'lighthouse-report.report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      displayResults(report);
    }

    // Kill server
    serverProcess.kill();
    console.log('🛑 Server stopped');

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

function displayResults(report) {
  console.log('📊 Performance Results:');
  console.log('========================\n');

  const categories = report.categories;
  const audits = report.audits;

  // Overall scores
  Object.entries(categories).forEach(([key, category]) => {
    const score = Math.round(category.score * 100);
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    console.log(`${emoji} ${category.title}: ${score}/100`);
  });

  console.log('\n🎯 Core Web Vitals:');
  console.log('===================');

  // Core Web Vitals
  const coreVitals = {
    'first-contentful-paint': 'First Contentful Paint',
    'largest-contentful-paint': 'Largest Contentful Paint',
    'total-blocking-time': 'Total Blocking Time',
    'cumulative-layout-shift': 'Cumulative Layout Shift',
    'speed-index': 'Speed Index',
  };

  Object.entries(coreVitals).forEach(([auditId, title]) => {
    const audit = audits[auditId];
    if (audit) {
      const value = audit.displayValue || audit.numericValue;
      const score = Math.round((audit.score || 0) * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`${emoji} ${title}: ${value} (${score}/100)`);
    }
  });

  console.log('\n⚡ Performance Opportunities:');
  console.log('=============================');

  // Performance opportunities
  const opportunities = Object.values(audits).filter(
    audit => audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0
  ).sort((a, b) => b.numericValue - a.numericValue);

  if (opportunities.length === 0) {
    console.log('🎉 No major performance opportunities found!');
  } else {
    opportunities.slice(0, 5).forEach(audit => {
      const savings = audit.displayValue || `${Math.round(audit.numericValue)}ms`;
      console.log(`• ${audit.title}: ${savings} potential savings`);
    });
  }

  console.log('\n📈 Bundle Analysis:');
  console.log('==================');

  // Bundle size info
  const totalByteWeight = audits['total-byte-weight'];
  if (totalByteWeight) {
    console.log(`Total Bundle Size: ${totalByteWeight.displayValue}`);
  }

  const unusedJs = audits['unused-javascript'];
  if (unusedJs && unusedJs.details && unusedJs.details.items) {
    const totalUnused = unusedJs.details.items.reduce((sum, item) => sum + item.wastedBytes, 0);
    if (totalUnused > 0) {
      console.log(`Unused JavaScript: ${Math.round(totalUnused / 1024)}KB`);
    }
  }

  const unusedCss = audits['unused-css-rules'];
  if (unusedCss && unusedCss.details && unusedCss.details.items) {
    const totalUnused = unusedCss.details.items.reduce((sum, item) => sum + item.wastedBytes, 0);
    if (totalUnused > 0) {
      console.log(`Unused CSS: ${Math.round(totalUnused / 1024)}KB`);
    }
  }

  console.log('\n📄 Full report available at: lighthouse-report.report.html');
}

// Run the test
if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = { runPerformanceTest };