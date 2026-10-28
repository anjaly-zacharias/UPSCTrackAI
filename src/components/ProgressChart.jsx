import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#182b24', padding: 11, cornerRadius: 9 } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#89928c', font: { family: 'Inter, sans-serif', size: 11 } } }, y: { grid: { color: '#eef0ed' }, border: { display: false }, ticks: { color: '#89928c', font: { family: 'Inter, sans-serif', size: 11 }, precision: 0 } } } };

export function StudyHoursChart({ tasks }) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = labels.map((_, offset) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - offset));
    const date = day.toISOString().slice(0, 10);
    return Math.round(tasks.filter((task) => task.completed && task.date === date).reduce((sum, task) => sum + Number(task.duration || 0), 0) / 60 * 10) / 10;
  });
  return <div className="chart-area"><Bar data={{ labels, datasets: [{ data: values, backgroundColor: values.map((_, index) => index === 6 ? '#436b58' : '#d8e6db'), borderRadius: 6, maxBarThickness: 30 }] }} options={options} /></div>;
}

export function CompletionChart({ tasks }) {
  const completed = tasks.filter((task) => task.completed).length;
  return <div className="donut-wrap"><div className="donut-chart"><Doughnut data={{ labels: ['Completed', 'In progress'], datasets: [{ data: [completed, Math.max(tasks.length - completed, 0)], backgroundColor: ['#436b58', '#e9eee9'], borderWidth: 0, hoverOffset: 4 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '78%', plugins: { legend: { display: false } } }} /><div className="donut-center"><b>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</b><span>complete</span></div></div><div className="donut-legend"><span><i className="legend-dot green" />Completed <b>{completed}</b></span><span><i className="legend-dot gray" />Remaining <b>{Math.max(tasks.length - completed, 0)}</b></span></div></div>;
}

export function SubjectProgressChart({ subjects, tasks }) {
  const labels = subjects.slice(0, 7).map((subject) => subject.name.replace('Indian ', '').replace(' & Ecology', ''));
  const values = subjects.slice(0, 7).map((subject) => {
    const related = tasks.filter((task) => task.subjectId === subject.id);
    return related.length ? Math.round(related.filter((task) => task.completed).length / related.length * 100) : 0;
  });
  return <div className="chart-area tall"><Line data={{ labels, datasets: [{ data: values, fill: true, backgroundColor: 'rgba(67,107,88,.08)', borderColor: '#436b58', tension: .38, pointRadius: 3, pointBackgroundColor: '#436b58' }] }} options={{ ...options, scales: { ...options.scales, y: { ...options.scales.y, min: 0, max: 100, ticks: { ...options.scales.y.ticks, callback: (value) => `${value}%` } } } }} /></div>;
}
