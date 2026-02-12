#!/usr/bin/env node

/**
 * Check Lighthouse performance budget
 * Fails the build if performance scores are below threshold
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BUDGET = {
  performance: 0.8,
  accessibility: 0.9,
  'best-practices': 0.9,
  seo: 0.9,
  pwa: 0.7,
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const METRICS_BUDGET = {
  'first-contentful-paint': 1800, // ms
  'largest-contentful-paint': 2500, // ms
  'cumulative-layout-shift': 0.1,
  'total-blocking-time': 200, // ms
  'speed-index': 3400, // ms
};

function loadLighthouseResults() {
  const lighthouseDir = path.join(process.cwd(), '.lighthouseci');

  if (!fs.existsSync(lighthouseDir)) {
    console.error('❌ Lighthouse results directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(lighthouseDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('manifest'));

  if (jsonFiles.length === 0) {
    console.error('❌ No Lighthouse result files found');
    process.exit(1);
  }

  return jsonFiles.map(file => {
    const content = fs.readFileSync(path.join(lighthouseDir, file), 'utf8');
    return JSON.parse(content);
  });
}

function checkBudget(results) {
  let hasError = false;
  let totalScore = 0;
  let count = 0;

  console.log('\n📊 Lighthouse Performance Budget Check\n');

  for (const result of results) {
    const url = result.requestedUrl || result.finalUrl;
    console.log(`\n🔍 Checking: ${url}\n`);

    // Check category scores
    const categories = result.categories || {};
    for (const [key, budget] of Object.entries(BUDGET)) {
      const category = categories[key];
      if (!category) continue;

      const score = category.score;
      totalScore += score;
      count++;

      const status = score >= budget ? '✅' : '❌';
      const percentage = Math.round(score * 100);
      const budgetPercentage = Math.round(budget * 100);

      console.log(`  ${status} ${key}: ${percentage}% (budget: ${budgetPercentage}%)`);

      if (score < budget) {
        hasError = true;
      }
    }

    // Check metrics
    const audits = result.audits || {};
    console.log('\n  Metrics:');
    for (const [key, budget] of Object.entries(METRICS_BUDGET)) {
      const audit = audits[key];
      if (!audit?.numericValue) continue;

      const value = audit.numericValue;
      const displayValue = audit.displayValue || `${Math.round(value)}`;

      const status = value <= budget ? '✅' : '❌';
      console.log(`    ${status} ${key}: ${displayValue} (budget: ${budget})`);

      if (value > budget) {
        hasError = true;
      }
    }
  }

  // Summary
  const avgScore = count > 0 ? Math.round((totalScore / count) * 100) : 0;
  console.log(`\n📈 Average Score: ${avgScore}%\n`);

  if (hasError) {
    console.error('❌ Performance budget check FAILED');
    console.error('   Some metrics are below the defined budget.\n');
    process.exit(1);
  } else {
    console.log('✅ All performance budgets met!\n');
    process.exit(0);
  }
}

// Run check
try {
  const results = loadLighthouseResults();
  checkBudget(results);
} catch (error) {
  console.error('❌ Error checking budget:', error.message);
  process.exit(1);
}
