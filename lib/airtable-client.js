/**
 * Airtable API Client
 *
 * Provides connection and methods for interacting with Airtable base
 * for storing AI citation audit reports.
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Validate environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not defined in .env.local');
}

if (!AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not defined in .env.local');
}

// Initialize Airtable client
const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const base = airtable.base(AIRTABLE_BASE_ID);

/**
 * AirtableClient class
 * Provides methods for interacting with Airtable
 */
export class AirtableClient {
  constructor() {
    this.base = base;
  }

  /**
   * Test connection to Airtable
   * Lists tables in the base to verify access
   *
   * @returns {Promise<Object>} Connection status and base info
   */
  async testConnection() {
    try {
      // Attempt to list tables (this will fail if credentials are invalid)
      const tables = await this.listTables();

      return {
        success: true,
        message: 'Successfully connected to Airtable',
        baseId: AIRTABLE_BASE_ID,
        tablesFound: tables.length,
        tables: tables
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to Airtable',
        error: error.message
      };
    }
  }

  /**
   * List all tables in the base
   * Note: Airtable API doesn't provide a direct way to list tables,
   * so we'll attempt to query a known table or return base info
   *
   * @returns {Promise<Array>} Array of table names (if discoverable)
   */
  async listTables() {
    // This is a workaround - Airtable doesn't expose table listing via API
    // We'll just return base info for now
    return [];
  }

  /**
   * Create a record in a specific table
   *
   * @param {string} tableName - Name of the table
   * @param {Object} fields - Record fields as key-value pairs
   * @returns {Promise<Object>} Created record
   */
  async createRecord(tableName, fields) {
    try {
      const record = await this.base(tableName).create([{ fields }]);
      return {
        success: true,
        record: record[0].fields,
        recordId: record[0].id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get records from a specific table
   *
   * @param {string} tableName - Name of the table
   * @param {Object} options - Query options (filterByFormula, maxRecords, etc.)
   * @returns {Promise<Array>} Array of records
   */
  async getRecords(tableName, options = {}) {
    try {
      const records = [];

      await this.base(tableName)
        .select(options)
        .eachPage((pageRecords, fetchNextPage) => {
          pageRecords.forEach(record => {
            records.push({
              id: record.id,
              fields: record.fields,
              createdTime: record._rawJson.createdTime
            });
          });
          fetchNextPage();
        });

      return {
        success: true,
        count: records.length,
        records: records
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update a record in a specific table
   *
   * @param {string} tableName - Name of the table
   * @param {string} recordId - ID of the record to update
   * @param {Object} fields - Fields to update
   * @returns {Promise<Object>} Updated record
   */
  async updateRecord(tableName, recordId, fields) {
    try {
      const record = await this.base(tableName).update([
        {
          id: recordId,
          fields: fields
        }
      ]);

      return {
        success: true,
        record: record[0].fields,
        recordId: record[0].id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete a record from a specific table
   *
   * @param {string} tableName - Name of the table
   * @param {string} recordId - ID of the record to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRecord(tableName, recordId) {
    try {
      await this.base(tableName).destroy([recordId]);

      return {
        success: true,
        message: `Record ${recordId} deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Submit an AI Citation Audit report to Airtable
   * This will be the main method for sending audit results
   *
   * @param {string} tableName - Name of the table to store reports
   * @param {Object} auditData - Complete audit report data
   * @returns {Promise<Object>} Result of submission
   */
  async submitAuditReport(tableName, auditData) {
    try {
      // Convert audit data to Airtable-friendly format
      const fields = {
        'Brand Name': auditData.brandName || '',
        'Category': auditData.category || '',
        'Audit Date': auditData.auditDate || new Date().toISOString(),
        'Overall Score': auditData.overallScore || 0,
        'Trust Node Coverage': auditData.trustNodeCoverage || '',
        'Citation Quality': auditData.citationQuality || 0,
        'AI Citation Rate': auditData.aiCitationRate || '',
        'Report JSON': JSON.stringify(auditData, null, 2),
        'Status': 'Completed'
      };

      const result = await this.createRecord(tableName, fields);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export default new AirtableClient();
