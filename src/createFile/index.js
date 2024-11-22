import { createEvents } from 'ics';
import { fetchNotionEvents } from '../utils/notionApi.js';

let cachedICS = '';

async function updateICSFile() {
  const events = await fetchNotionEvents();

  const { value, error } = createEvents(events);

  if (error) {
    console.error('Ошибка создания ICS файла:', error);
    return;
  }

  cachedICS = value;
  console.log('ICS файл обновлен:', new Date().toLocaleString());
}

function getCachedICS() {
  return cachedICS;
}

export { updateICSFile, getCachedICS };
