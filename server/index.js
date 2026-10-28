import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 3001);
const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data.json');
const seed = {
  subjects: [
    { id: 'polity', name: 'Indian Polity', icon: 'bi-bank2', color: '#5267d8', target: 120, topics: ['Constitution', 'Parliament', 'Federalism'] },
    { id: 'economy', name: 'Indian Economy', icon: 'bi-graph-up-arrow', color: '#d38c37', target: 100, topics: ['Budget', 'Inflation', 'Banking'] },
    { id: 'history', name: 'Indian History', icon: 'bi-hourglass-split', color: '#b76c58', target: 90, topics: ['Modern India', 'National Movement'] },
    { id: 'geography', name: 'Indian Geography', icon: 'bi-globe-asia-australia', color: '#4d9877', target: 80, topics: ['Physical Geography', 'Monsoon'] },
    { id: 'environment', name: 'Environment & Ecology', icon: 'bi-tree', color: '#63a77b', target: 70, topics: ['Biodiversity', 'Climate Change'] },
    { id: 'science', name: 'Science & Technology', icon: 'bi-lightbulb', color: '#8b70bc', target: 65, topics: ['Space', 'Biotechnology'] },
    { id: 'culture', name: 'Art & Culture', icon: 'bi-brush', color: '#c47c9a', target: 55, topics: ['Architecture', 'Performing Arts'] },
    { id: 'current', name: 'Current Affairs', icon: 'bi-newspaper', color: '#478da0', target: 90, topics: ['Daily News', 'Monthly Revision'] },
    { id: 'csat', name: 'CSAT', icon: 'bi-calculator', color: '#73849a', target: 50, topics: ['Comprehension', 'Numeracy'] },
    { id: 'ethics', name: 'Ethics & Essay', icon: 'bi-journal-text', color: '#bd8d4e', target: 60, topics: ['Ethics Case Studies', 'Essay Practice'] },
  ],
  tasks: [
    { id: 't1', title: 'Revise Fundamental Rights', subjectId: 'polity', topic: 'Fundamental Rights', date: new Date().toISOString().slice(0, 10), duration: 60, priority: 'High', completed: true, notes: 'Review landmark cases' },
    { id: 't2', title: 'Read about monetary policy', subjectId: 'economy', topic: 'Monetary Policy', date: new Date().toISOString().slice(0, 10), duration: 90, priority: 'Medium', completed: false, notes: '' },
    { id: 't3', title: 'Newspaper analysis and notes', subjectId: 'current', topic: 'Daily News', date: new Date().toISOString().slice(0, 10), duration: 45, priority: 'High', completed: false, notes: '' },
    { id: 't4', title: 'Practice map-based questions', subjectId: 'geography', topic: 'Indian Rivers', date: new Date().toISOString().slice(0, 10), duration: 45, priority: 'Low', completed: false, notes: '' },
    { id: 't5', title: 'Modern India: 1857–1885', subjectId: 'history', topic: 'Modern India', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), duration: 75, priority: 'Medium', completed: true, notes: '' },
  ],
  sessions: [
    { id: 's1', date: new Date().toISOString().slice(0, 10), start: '06:30', end: '08:00', subjectId: 'current', topic: 'Newspaper & editorial', priority: 'High', description: 'Read, annotate, and make concise notes', completed: false },
    { id: 's2', date: new Date().toISOString().slice(0, 10), start: '09:00', end: '11:00', subjectId: 'polity', topic: 'Constitutional framework', priority: 'High', description: 'NCERT + standard reference', completed: false },
    { id: 's3', date: new Date().toISOString().slice(0, 10), start: '11:30', end: '12:30', subjectId: 'economy', topic: 'Monetary policy', priority: 'Medium', description: 'Concept review and practice questions', completed: false },
    { id: 's4', date: new Date().toISOString().slice(0, 10), start: '15:00', end: '16:00', subjectId: 'history', topic: 'Modern India revision', priority: 'Low', description: 'Active recall', completed: false },
  ],
};

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function readData() {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeData(seed);
    return structuredClone(seed);
  }
}

async function writeData(data) {
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/data', async (_req, res, next) => {
  try { res.json(await readData()); } catch (error) { next(error); }
});

for (const collection of ['subjects', 'tasks', 'sessions']) {
  app.post(`/api/${collection}`, async (req, res, next) => {
    try {
      const data = await readData();
      const item = { ...req.body, id: req.body.id || randomUUID() };
      data[collection].push(item);
      await writeData(data);
      res.status(201).json(item);
    } catch (error) { next(error); }
  });
  app.put(`/api/${collection}/:id`, async (req, res, next) => {
    try {
      const data = await readData();
      const index = data[collection].findIndex((item) => item.id === req.params.id);
      if (index < 0) return res.status(404).json({ message: 'Item not found.' });
      data[collection][index] = { ...data[collection][index], ...req.body, id: req.params.id };
      await writeData(data);
      res.json(data[collection][index]);
    } catch (error) { next(error); }
  });
  app.delete(`/api/${collection}/:id`, async (req, res, next) => {
    try {
      const data = await readData();
      const remaining = data[collection].filter((item) => item.id !== req.params.id);
      if (remaining.length === data[collection].length) return res.status(404).json({ message: 'Item not found.' });
      data[collection] = remaining;
      await writeData(data);
      res.status(204).end();
    } catch (error) { next(error); }
  });
}

app.post('/api/assistant', async (req, res, next) => {
  const { prompt = '', context = {} } = req.body;
  const pending = Array.isArray(context.tasks) ? context.tasks.filter((task) => !task.completed) : [];
  const suggestions = [
    pending.length
      ? `Start with “${pending[0].title}” while your focus is fresh, then take a short reset break.`
      : 'Your task list is clear. Use this time for a timed revision or a short practice test.',
    'Use active recall: close your notes and write down the key ideas before checking what you missed.',
    'Protect a small daily revision block. Revisiting material at spaced intervals improves retention.',
  ];
  if (process.env.AI_API_URL && process.env.AI_API_KEY) {
    try {
      const response = await fetch(process.env.AI_API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.AI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a practical UPSC civil services study coach. Give concise, realistic, supportive guidance; do not claim certainty about exam outcomes.' },
            { role: 'user', content: JSON.stringify({ question: prompt, preparationContext: context }) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const result = await response.json();
      const message = result.choices?.[0]?.message?.content;
      if (!message) throw new Error('AI provider returned an empty response.');
      return res.json({ message, suggestions, source: 'ai' });
    } catch (error) {
      return next(error);
    }
  }
  res.json({
    message: prompt.trim()
      ? `For “${prompt.trim()}”: break the topic into a focused 25-minute reading block, a 5-minute recall exercise, and a short set of practice questions.`
      : suggestions[0],
    suggestions,
    source: 'built-in',
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'The server could not complete that request.' });
});

app.listen(port, () => console.log(`UPSC Track API listening on http://localhost:${port}`));
