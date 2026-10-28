const today = new Date().toISOString().slice(0, 10);

export const initialData = {
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
    { id: 't1', title: 'Revise Fundamental Rights', subjectId: 'polity', topic: 'Fundamental Rights', date: today, duration: 60, priority: 'High', completed: true, notes: 'Review landmark cases' },
    { id: 't2', title: 'Read about monetary policy', subjectId: 'economy', topic: 'Monetary Policy', date: today, duration: 90, priority: 'Medium', completed: false, notes: '' },
    { id: 't3', title: 'Newspaper analysis and notes', subjectId: 'current', topic: 'Daily News', date: today, duration: 45, priority: 'High', completed: false, notes: '' },
    { id: 't4', title: 'Practice map-based questions', subjectId: 'geography', topic: 'Indian Rivers', date: today, duration: 45, priority: 'Low', completed: false, notes: '' },
    { id: 't5', title: 'Modern India: 1857–1885', subjectId: 'history', topic: 'Modern India', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), duration: 75, priority: 'Medium', completed: true, notes: '' },
  ],
  sessions: [
    { id: 's1', date: today, start: '06:30', end: '08:00', subjectId: 'current', topic: 'Newspaper & editorial', priority: 'High', description: 'Read, annotate, and make concise notes', completed: false },
    { id: 's2', date: today, start: '09:00', end: '11:00', subjectId: 'polity', topic: 'Constitutional framework', priority: 'High', description: 'NCERT + standard reference', completed: false },
    { id: 's3', date: today, start: '11:30', end: '12:30', subjectId: 'economy', topic: 'Monetary policy', priority: 'Medium', description: 'Concept review and practice questions', completed: false },
    { id: 's4', date: today, start: '15:00', end: '16:00', subjectId: 'history', topic: 'Modern India revision', priority: 'Low', description: 'Active recall', completed: false },
  ],
};
