// import { createEvents } from 'ics';
// import { fetchNotionEvents } from '../utils/notionApi.js';

// let cachedICS = '';

// async function updateICSFile() {
//   const events = await fetchNotionEvents();

//   const { value, error } = createEvents(events);

//   if (error) {
//     console.error('Ошибка создания ICS файла:', error);
//     return;
//   }

//   cachedICS = value;
//   console.log('ICS файл обновлен:', new Date().toLocaleString());
// }

// function getCachedICS() {
//   return cachedICS;
// }

// export { updateICSFile, getCachedICS };

import { createEvents } from 'ics';
import { fetchNotionEvents } from '../utils/notionApi.js';

let cachedICS = '';

async function updateICSFile() {
  const events = await fetchNotionEvents();

  const updatedEvents = events.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
  }));

  const { value, error } = createEvents(updatedEvents);

  if (error) {
    console.error('Ошибка создания ICS файла:', error);
    return;
  }

  const timeZoneSection = `
BEGIN:VTIMEZONE
TZID:Europe/Moscow
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0300
TZOFFSETTO:+0300
TZNAME:MSK
END:STANDARD
END:VTIMEZONE
  `.trim();

  cachedICS = value.replace('BEGIN:VEVENT', `${timeZoneSection}\nBEGIN:VEVENT`);
  console.log('ICS файл обновлен:', new Date().toLocaleString());
}

function getCachedICS() {
  return cachedICS;
}

export { updateICSFile, getCachedICS };
