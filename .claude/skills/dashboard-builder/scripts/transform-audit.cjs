#!/usr/bin/env node

/**
 * Dashboard Builder - Data Transformation Script
 *
 * Transforms markdown audit reports into structured JSON for dashboard visualization.
 * This demonstrates the "bridge" between audit data and dashboard display.
 */

const fs = require('fs');
const path = require('path');

// Get audit file from command line argument
const auditFile = process.argv[2];

if (!auditFile) {
  console.error('Usage: node transform-audit.js <path-to-audit.md>');
  process.exit(1);
}

console.log('🔄 Dashboard Builder - Data Transformation');
console.log('==========================================\n');
console.log(`📄 Input: ${auditFile}`);

// Read the markdown file
let markdown;
try {
  markdown = fs.readFileSync(auditFile, 'utf-8');
  console.log(`✅ Loaded audit file (${markdown.length} characters)\n`);
} catch (error) {
  console.error(`❌ Error reading file: ${error.message}`);
  process.exit(1);
}

// Extract brand and category from header
const brandMatch = markdown.match(/\*\*Brand:\*\* (.+)/);
const categoryMatch = markdown.match(/\*\*Category:\*\* (.+)/);
const dateMatch = markdown.match(/\*\*Date:\*\* (.+)/);

const brand = brandMatch ? brandMatch[1].trim() : 'Unknown';
const category = categoryMatch ? categoryMatch[1].trim() : 'Unknown';
const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

console.log('📊 Extracted Metadata:');
console.log(`   Brand: ${brand}`);
console.log(`   Category: ${category}`);
console.log(`   Date: ${date}\n`);

// Extract overall score
const scoreMatch = markdown.match(/\*\*Overall AI Visibility Score:\*\* ([\d.]+)\/10/);
const overallScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

// Extract trust node coverage
const trustNodeMatch = markdown.match(/\*\*Overall Coverage:\*\* (\d+)\/(\d+) trust nodes \(([\d.]+)%\)/);
const trustNodeCoverage = trustNodeMatch ? parseInt(trustNodeMatch[1]) : 0;
const trustNodeTotal = trustNodeMatch ? parseInt(trustNodeMatch[2]) : 29;
const trustNodePercentage = trustNodeMatch ? parseFloat(trustNodeMatch[3]) : 0;

// Extract citation quality
const citationQualityMatch = markdown.match(/\*\*Average Citation Quality:\*\* ([\d.]+)\/10/);
const citationQuality = citationQualityMatch ? parseFloat(citationQualityMatch[1]) : 0;

// Extract AI citation rate
const aiCitationRateMatch = markdown.match(/\*\*AI Citation Rate:\*\* (\d+)%/);
const aiCitationRate = aiCitationRateMatch ? parseInt(aiCitationRateMatch[1]) : 0;

console.log('🔍 Extracted Key Metrics:');
console.log(`   Overall Score: ${overallScore}/10`);
console.log(`   Trust Nodes: ${trustNodeCoverage}/${trustNodeTotal} (${trustNodePercentage}%)`);
console.log(`   Citation Quality: ${citationQuality}/10`);
console.log(`   AI Citation Rate: ${aiCitationRate}%\n`);

// Extract trust node categories
const categoryTable = markdown.match(/\| Category \| Coverage \| Status \|([\s\S]*?)(?=\n\n|\*\*Trust Node Health)/);
const categories = [];

if (categoryTable) {
  const rows = categoryTable[1].split('\n').filter(row =>
    row.trim() &&
    !row.includes('---') &&
    !row.includes('Category')
  );

  rows.forEach(row => {
    const match = row.match(/\|\s*([^|]+)\s*\|\s*([\d.]+)\/([\d.]+)\s*\|\s*([^|]+)\s*\|/);
    if (match) {
      categories.push({
        name: match[1].trim(),
        coverage: parseFloat(match[2]),
        total: parseFloat(match[3]),
        status: match[4].trim()
      });
    }
  });
}

console.log(`📈 Extracted Trust Node Categories: ${categories.length}`);
categories.forEach(cat => {
  console.log(`   - ${cat.name}: ${cat.coverage}/${cat.total}`);
});
console.log();

// Extract LLM platform rankings - handle both 4 and 5 column tables
const llmTable = markdown.match(/\| Platform \| Brand Cited\? \| Position \| Citations Found(?: \| [^|]+)? \|([\s\S]*?)(?=\n\n|\*\*AI Citation Rate)/);
const platforms = [];

if (llmTable) {
  const rows = llmTable[1].split('\n').filter(row =>
    row.trim() &&
    !row.includes('---') &&
    !row.includes('Platform')
  );

  rows.forEach(row => {
    // Handle both 4 and 5 column formats
    const parts = row.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length >= 4) {
      platforms.push({
        platform: parts[0],
        cited: parts[1],
        position: parts[2],
        citations: parts[3]
      });
    }
  });
}

console.log(`🤖 Extracted LLM Platform Rankings: ${platforms.length}`);
platforms.forEach(p => {
  console.log(`   - ${p.platform}: ${p.cited} at ${p.position}`);
});
console.log();

// Extract citation quality dimensions
const dimensions = {
  authority: 0,
  dataStructure: 0,
  brandAlignment: 0,
  freshness: 0,
  crossLinks: 0
};

const dimensionMatches = {
  authority: markdown.match(/Authority.*?([\d.]+)\/10/i),
  dataStructure: markdown.match(/Data Structure.*?([\d.]+)\/10/i),
  brandAlignment: markdown.match(/Brand Alignment.*?([\d.]+)\/10/i),
  freshness: markdown.match(/Freshness.*?([\d.]+)\/10/i),
  crossLinks: markdown.match(/Cross-Link.*?([\d.]+)\/10/i)
};

Object.keys(dimensionMatches).forEach(key => {
  if (dimensionMatches[key]) {
    dimensions[key] = parseFloat(dimensionMatches[key][1]);
  }
});

console.log('📊 Extracted Citation Quality Dimensions:');
Object.keys(dimensions).forEach(key => {
  console.log(`   - ${key}: ${dimensions[key]}/10`);
});
console.log();

// Extract top 3 priorities
const priorities = [];
const prioritySection = markdown.match(/### 🔴 IMMEDIATE PRIORITIES[\s\S]*?(\*\*Priority 1:[\s\S]*?)(?=### 🟡|---)/);

if (prioritySection) {
  const priorityBlocks = prioritySection[1].match(/\*\*Priority \d+:([\s\S]*?)(?=\*\*Priority \d+:|$)/g);

  if (priorityBlocks) {
    priorityBlocks.slice(0, 3).forEach((block, i) => {
      const titleMatch = block.match(/\*\*Priority \d+: (.+?)\*\*/);
      const actionMatch = block.match(/- Action: (.+?)(?=\n- |$)/s);
      const timelineMatch = block.match(/- Timeline: (.+?)(?=\n|$)/);

      if (titleMatch) {
        priorities.push({
          level: 'Immediate',
          title: titleMatch[1].trim(),
          action: actionMatch ? actionMatch[1].trim() : '',
          timeline: timelineMatch ? timelineMatch[1].trim() : ''
        });
      }
    });
  }
}

console.log(`🎯 Extracted Priorities: ${priorities.length}`);
priorities.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.title}`);
});
console.log();

// Build the transformed JSON data
const transformedData = {
  metadata: {
    brand,
    category,
    date,
    transformedAt: new Date().toISOString()
  },
  summary: {
    overallScore,
    trustNodeCoverage,
    trustNodeTotal,
    trustNodePercentage,
    citationQuality,
    aiCitationRate
  },
  trustNodes: {
    categories,
    overall: {
      coverage: trustNodeCoverage,
      total: trustNodeTotal,
      percentage: trustNodePercentage
    }
  },
  citationQuality: {
    overall: citationQuality,
    dimensions
  },
  llmRankings: platforms,
  priorities
};

// Write the transformed JSON
const outputDir = path.join(__dirname, '..', '..', '..', 'dashboard', 'public', 'data');
const outputFile = path.join(outputDir, 'audit-data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(transformedData, null, 2));

console.log('✅ Transformation Complete!');
console.log(`📁 Output: ${outputFile}`);
console.log(`📦 JSON Size: ${JSON.stringify(transformedData).length} bytes\n`);

console.log('🎯 Summary:');
console.log(`   ✓ Extracted ${categories.length} trust node categories`);
console.log(`   ✓ Extracted ${platforms.length} LLM platform rankings`);
console.log(`   ✓ Extracted ${priorities.length} priorities`);
console.log(`   ✓ Extracted 5 citation quality dimensions`);
console.log(`   ✓ Generated structured JSON for dashboard\n`);

console.log('🚀 Dashboard Ready!');
console.log('   Run: npm run dev (from dashboard directory)');
console.log('   Dashboard will load transformed data automatically\n');

process.exit(0);
