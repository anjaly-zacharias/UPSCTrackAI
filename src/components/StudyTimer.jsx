import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStudyMinutes, setElapsed, startTimer, stopTimer } from '../store/plannerSlice';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function StudyTimer() {
  const dispatch = useDispatch();
  const { timer, elapsedSeconds } = useSelector((state) => state.planner);
  const subjects = useSelector((state) => state.subjects);
  useEffect(() => {
    if (!timer) return undefined;
    const interval = window.setInterval(() => dispatch(setElapsed(Math.floor((Date.now() - timer.startedAt) / 1000))), 1000);
    return () => window.clearInterval(interval);
  }, [timer, dispatch]);
  const finish = () => {
    dispatch(addStudyMinutes(Math.floor(elapsedSeconds / 60)));
    dispatch(stopTimer());
  };
  return (
    <div className="timer-card">
      <div className="panel-heading"><div><span className="eyebrow">FOCUS MODE</span><h3>Study timer</h3></div><span className="timer-status"><span />{timer ? 'In session' : 'Ready when you are'}</span></div>
      <div className="timer-clock">{formatTime(elapsedSeconds)}</div>
      <div className="timer-caption">{timer ? `${subjects.find((item) => item.id === timer.subjectId)?.name || 'Focused study'} · ${timer.topic}` : 'A little focused time goes a long way.'}</div>
      <div className="timer-actions">{timer ? <><button className="btn btn-primary" onClick={finish}><i className="bi bi-stop-fill me-2" />Finish session</button><button className="btn btn-light" onClick={() => dispatch(stopTimer())}>Reset</button></> : <button className="btn btn-primary" onClick={() => dispatch(startTimer({ subjectId: subjects[0]?.id, topic: 'Focused study' }))}><i className="bi bi-play-fill me-2" />Start focus session</button>}</div>
    </div>
  );
}
