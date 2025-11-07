#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

try {
  console.log('Checking Trust Node: rec0B68aHeN66qsQV\n');
  const node = await base('Trust_Nodes').find('rec0B68aHeN66qsQV');
  console.log('Fields:', JSON.stringify(node.fields, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}
