/**
 * Test Airtable Connection
 *
 * Verifies that the Airtable API credentials are valid
 * and the connection is working properly.
 */

import airtableClient from '../lib/airtable-client.js';

async function testConnection() {
  console.log('🔗 Testing Airtable connection...\n');

  try {
    // Test basic connection
    const connectionResult = await airtableClient.testConnection();

    if (connectionResult.success) {
      console.log('✅ Connection successful!');
      console.log(`   Base ID: ${connectionResult.baseId}`);
      console.log(`   Tables found: ${connectionResult.tablesFound}`);

      // Test creating a sample record (you'll need to specify a table name)
      console.log('\n📝 Testing record creation...');
      console.log('   Note: To test record creation, you need to specify a table name in your Airtable base.');
      console.log('   Example usage:');
      console.log('   const result = await airtableClient.createRecord("YourTableName", { "Field Name": "Value" });');

      console.log('\n✨ Airtable client is ready to use!');
      console.log('\nAvailable methods:');
      console.log('  - airtableClient.createRecord(tableName, fields)');
      console.log('  - airtableClient.getRecords(tableName, options)');
      console.log('  - airtableClient.updateRecord(tableName, recordId, fields)');
      console.log('  - airtableClient.deleteRecord(tableName, recordId)');
      console.log('  - airtableClient.submitAuditReport(tableName, auditData)');

      console.log('\n📚 Next steps:');
      console.log('  1. Create a table in your Airtable base (e.g., "AI Citation Audits")');
      console.log('  2. Add fields like: Brand Name, Category, Audit Date, Overall Score, etc.');
      console.log('  3. Use airtableClient.submitAuditReport() to send audit results');

    } else {
      console.log('❌ Connection failed!');
      console.log(`   Error: ${connectionResult.error}`);
      console.log('\n🔍 Troubleshooting:');
      console.log('  1. Check that AIRTABLE_API_KEY is correct in .env.local');
      console.log('  2. Check that AIRTABLE_BASE_ID is correct in .env.local');
      console.log('  3. Verify your Airtable API key has access to the base');
      console.log('  4. Ensure the base exists in your Airtable account');
    }

  } catch (error) {
    console.log('❌ Unexpected error:');
    console.error(error);
  }
}

// Run the test
testConnection();
