import express from 'express';
import { updateICSFile, getCachedICS } from '../createFile/index.js';

const app = express();
const PORT = 3000;

app.get('/calendar.ics', (req, res) => {
  const cachedICS = getCachedICS();

  if (!cachedICS) {
    return res.status(500).send('Файл ICS еще не готов, попробуйте позже.');
  }

  res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
  res.setHeader('Content-Type', 'text/calendar');
  res.send(cachedICS);
});

app.listen(PORT, async () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);

  await updateICSFile();

  const UPDATE_INTERVAL = 2 * 60 * 60 * 1000;
  setInterval(updateICSFile, UPDATE_INTERVAL);
});
