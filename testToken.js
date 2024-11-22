import dotenv from 'dotenv';
dotenv.config();

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function testConnection() {
  try {
    const response = await notion.search({ query: '' });
    console.log('Successfully connected to Notion API:', response);
  } catch (error) {
    console.error('Failed to connect to Notion API:', error);
  }
}
testConnection();
