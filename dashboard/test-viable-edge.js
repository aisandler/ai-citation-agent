const fs = require('fs');
const path = require('path');

// Read the Viable Edge audit file
const auditPath = path.join(__dirname, '..', 'output', 'viable-edge-audit-report-2025-10-29.md');
const markdown = fs.readFileSync(auditPath, 'utf-8');

// Test trust node coverage extraction
const coverageMatch = markdown.match(
  /## STEP 1 RESULTS: Source & Citation Discovery[\s\S]*?### Trust Node Coverage Map[\s\S]*?\*\*Overall Coverage:\*\* (\d+)\/(\d+) trust nodes \(([\d.]+)%\)([\s\S]*?)(?=### Critical Missing Nodes|$)/
);

console.log('===== TRUST NODE COVERAGE =====');
console.log('Coverage Match Found:', !!coverageMatch);
if (coverageMatch) {
  console.log('Coverage:', coverageMatch[1]);
  console.log('Total:', coverageMatch[2]);
  console.log('Percentage:', coverageMatch[3]);

  const tableSection = coverageMatch[4];
  console.log('\nTable section length:', tableSection.length);
  console.log('\nTable section preview:', tableSection.substring(0, 300));
} else {
  console.log('\nDEBUG: Looking for section manually...');
  const section = markdown.match(/## STEP 1 RESULTS[\s\S]{0,1000}/);
  if (section) console.log('Section found:\n', section[0]);
}

// Test LLM rankings
console.log('\n\n===== LLM RANKINGS =====');
const rankingsMatch = markdown.match(
  /## STEP 3 RESULTS: LLM Response Evaluation([\s\S]*?)(?=^## |$)/m
);
console.log('LLM Rankings Match Found:', !!rankingsMatch);

if (rankingsMatch) {
  const content = rankingsMatch[1];
  console.log('Content length:', content.length);
  console.log('\nLooking for table...');

  const tableMatch = content.match(
    /\| Platform \| Brand Cited\? \| Position \| Citations Found \|[\s\S]*?\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n?)+)/
  );

  console.log('Table match found:', !!tableMatch);

  if (tableMatch) {
    const rows = tableMatch[1]
      .split('\n')
      .filter(row => row.trim() && !row.includes('---') && !row.includes('Platform'));
    console.log('Filtered rows:', rows.length);
    rows.forEach((row, i) => console.log(`Row ${i}:`, row));
  } else {
    console.log('\nDEBUG: Table section preview:\n', content.substring(0, 800));
  }
}

// Test Priorities
console.log('\n\n===== PRIORITIES =====');
const prioritiesMatch = markdown.match(
  /### 🔴 IMMEDIATE PRIORITIES \(This Month\)([\s\S]*?)(?=###|^## |$)/m
);
console.log('Priorities Match Found:', !!prioritiesMatch);

if (prioritiesMatch) {
  const content = prioritiesMatch[1];
  console.log('Content length:', content.length);
  console.log('\nContent preview:\n', content.substring(0, 500));
}
