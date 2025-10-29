const fs = require('fs');
const path = require('path');

// Read the audit file
const auditPath = path.join(__dirname, '..', 'output', 'klaviyo-audit-report-2025-10-29.md');
const markdown = fs.readFileSync(auditPath, 'utf-8');

// Test trust node coverage extraction
const coverageMatch = markdown.match(
  /## STEP 1 RESULTS: Source & Citation Discovery[\s\S]*?### Trust Node Coverage Map[\s\S]*?\*\*Overall Coverage:\*\* (\d+)\/(\d+) trust nodes \((\d+)%\)([\s\S]*?)(?=### Critical Missing Nodes|$)/
);

console.log('Coverage Match Found:', !!coverageMatch);
if (coverageMatch) {
  console.log('Coverage:', coverageMatch[1]);
  console.log('Total:', coverageMatch[2]);
  console.log('Percentage:', coverageMatch[3]);
  
  const tableSection = coverageMatch[4];
  console.log('\nTable section length:', tableSection.length);
  console.log('\nTable section preview:', tableSection.substring(0, 300));
}

// Test LLM rankings
const rankingsMatch = markdown.match(
  /## STEP 3 RESULTS: LLM Response Evaluation([\s\S]*?)(?=^## )/m
);
console.log('\n\nLLM Rankings Match Found:', !!rankingsMatch);

if (rankingsMatch) {
  const content = rankingsMatch[1];

  console.log('Content preview (first 500 chars):');
  console.log(content.substring(0, 500));

  // Try new approach - escape the ? in regex
  const tableMatch = content.match(
    /\| Platform \| Brand Cited\? \| Position \| Citations Found \|[\s\S]*?\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n?)+)/
  );

  // Alternative: look for table by structure without exact header match
  const altTableMatch = content.match(
    /\|[\s\S]*?Platform[\s\S]*?\|[\s\S]*?\n\|[-\s|]+\|\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n?)+)/
  );

  console.log('Table match found:', !!tableMatch);
  console.log('Alt table match found:', !!altTableMatch);

  const finalMatch = tableMatch || altTableMatch;

  if (finalMatch) {
    const rows = finalMatch[1]
      .split('\n')
      .filter(row => row.trim() && !row.includes('---') && !row.includes('Platform'));
    console.log('Filtered rows:', rows.length);
    rows.forEach((row, i) => console.log(`Row ${i}:`, row));

    const platformRows = rows.filter(row =>
      row.includes('Perplexity') || row.includes('ChatGPT') || row.includes('Gemini')
    );
    console.log('\nPlatform rows:', platformRows.length);
    platformRows.forEach((row, i) => console.log(`Platform ${i}:`, row));
  }
}
