import { Client } from '@notionhq/client';
// import fs from 'fs';
// import dotenv from 'dotenv';
// dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.CALENDAR_DB;

async function fetchNotionEvents() {
  if (!databaseId) {
    console.error('CALENDAR_DB не задана');
    return [];
  }

  try {
    const response = await notion.databases.query({ database_id: databaseId });

    // console.log('Данные от Notion:', JSON.stringify(response, null, 2));
    // fs.writeFileSync('notionData.json', JSON.stringify(response, null, 2), 'utf-8');
    // console.log('Данные от Notion сохранены в файл notionData.json');

    return response.results
      .map((page) => {
        const name = page.properties.person?.rollup?.array?.[0]?.people?.[0]?.name || 'Без имени';
        const date = page.properties['даты отсутствия']?.date;

        if (!date || !date.start) return null;

        const start = date.start.split('-').map(Number);

        let end;
        if (date.end) {
          const endDate = new Date(date.end);
          endDate.setDate(endDate.getDate() + 1);
          end = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()];
        } else {
          const startDate = new Date(date.start);
          startDate.setDate(startDate.getDate() + 1);
          end = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()];
        }

        return {
          title: `${name} Отсутствие`,
          start,
          end,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Ошибка получения данных из Notion:', error);
    return [];
  }
}

export { fetchNotionEvents };
