import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.CALENDAR_DB;

async function fetchNotionEvents() {
  if (!databaseId) {
    console.error('CALENDAR_DB не задана');
    return [];
  }

  try {
    const response = await notion.databases.query({ database_id: databaseId });

    return response.results
      .map((page) => {
        const name = page.properties.person?.rollup?.array?.[0]?.people?.[0]?.name || 'Без имени';
        const date = page.properties['даты отсутствия']?.date;

        if (!date || !date.start || !date.end) return null;

        const start = date.start.split('-').map(Number);
        const end = date.end.split('-').map(Number);

        const adjustedEnd = new Date(end[0], end[1] - 1, end[2]);
        adjustedEnd.setDate(adjustedEnd.getDate() + 1);

        const correctedEnd = [
          adjustedEnd.getFullYear(),
          adjustedEnd.getMonth() + 1,
          adjustedEnd.getDate(),
        ];

        return {
          title: `${name} Отсутствие`,
          start,
          end: correctedEnd,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Ошибка получения данных из Notion:', error);
    return [];
  }
}

export { fetchNotionEvents };
