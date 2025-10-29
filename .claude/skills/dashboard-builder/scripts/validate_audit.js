#!/usr/bin/env node

/**
 * Validates that an audit markdown file can be parsed by the dashboard
 * Usage: node validate_audit.js <path-to-audit.md>
 */

const fs = require('fs');
const path = require('path');

// Import parser from dashboard (relative path from project root)
const dashboardRoot = path.join(__dirname, '../../../dashboard');
const { parseAudit } = require(path.join(dashboardRoot, 'lib/parser/markdownParser.ts').replace('.ts', '.js'));

function validateAuditFile(filePath) {
  console.log(`\n🔍 Validating audit file: ${filePath}\n`);

  // Check file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at ${filePath}`);
    process.exit(1);
  }

  // Read file content
  const markdown = fs.readFileSync(filePath, 'utf-8');

  if (!markdown || markdown.trim().length === 0) {
    console.error('❌ Error: File is empty');
    process.exit(1);
  }

  console.log(`✅ File exists and is readable (${(markdown.length / 1024).toFixed(1)} KB)`);

  // Parse the audit
  let parsed;
  try {
    parsed = parseAudit(markdown, filePath);
  } catch (error) {
    console.error(`❌ Parsing Error: ${error.message}`);
    process.exit(1);
  }

  // Validate parsed data
  const validations = [
    { name: 'Brand Name', value: parsed.metadata.brand, required: true },
    { name: 'Category', value: parsed.metadata.category, required: true },
    { name: 'Overall Score', value: parsed.executiveSummary.overallScore, required: true, min: 0, max: 10 },
    { name: 'Trust Node Coverage', value: parsed.trustNodeCoverage.overall.coverage, required: true, min: 0 },
    { name: 'Citation Quality', value: parsed.citationQuality.average, required: true, min: 0, max: 10 },
    { name: 'LLM Platforms', value: parsed.llmRankings.platforms.length, required: true, min: 1 },
    { name: 'Priorities', value: parsed.priorities.immediate.length + parsed.priorities.strategic.length, required: true, min: 1 }
  ];

  console.log('\n📊 Validation Results:\n');

  let hasErrors = false;
  validations.forEach(({ name, value, required, min, max }) => {
    const status = value !== undefined && value !== null && value !== '' ? '✅' : '❌';
    console.log(`${status} ${name}: ${value !== undefined ? value : 'MISSING'}`);

    if (required && (value === undefined || value === null || value === '')) {
      hasErrors = true;
    }
    if (min !== undefined && value < min) {
      console.log(`   ⚠️  Warning: Value ${value} is below minimum ${min}`);
      hasErrors = true;
    }
    if (max !== undefined && value > max) {
      console.log(`   ⚠️  Warning: Value ${value} exceeds maximum ${max}`);
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.log('\n❌ Validation FAILED - audit file has missing or invalid data\n');
    process.exit(1);
  }

  console.log('\n✅ Validation PASSED - audit file is ready for dashboard deployment\n');

  // Print summary
  console.log('📋 Audit Summary:');
  console.log(`   Brand: ${parsed.metadata.brand}`);
  console.log(`   Category: ${parsed.metadata.category}`);
  console.log(`   Overall Score: ${parsed.executiveSummary.overallScore}/10`);
  console.log(`   Trust Node Coverage: ${parsed.trustNodeCoverage.overall.coverage}/${parsed.trustNodeCoverage.overall.total} (${parsed.trustNodeCoverage.overall.percentage}%)`);
  console.log(`   Citation Quality: ${parsed.citationQuality.average}/10`);
  console.log(`   AI Citation Rate: ${parsed.llmRankings.aiCitationRate}%`);
  console.log(`   Priorities: ${validations[6].value} total\n`);

  process.exit(0);
}

// Main execution
const auditFile = process.argv[2];

if (!auditFile) {
  console.error('Usage: node validate_audit.js <path-to-audit.md>');
  process.exit(1);
}

validateAuditFile(auditFile);
