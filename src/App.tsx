import { useState, type FormEvent } from 'react';
import { addTask, completeTask, deleteTask, isValidTitle, type Task } from './tasks';
import { loadTasks, saveTasks } from './taskStorage';

export default function App() {
  const [loaded] = useState(() => loadTasks());
  const [tasks, setTasks] = useState<Task[]>(loaded.ok ? loaded.tasks : []);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(loaded.ok ? '' : loaded.error);

  function persist(candidate: Task[]): boolean {
    const result = saveTasks(candidate);
    if (!result.ok) {
      setError('Could not save this change. Your saved tasks were not changed; check browser storage and try again.');
      return false;
    }
    setTasks(candidate);
    setError('');
    return true;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidTitle(draft)) {
      setError('Enter a task title containing at least one non-whitespace character.');
      return;
    }
    let id: string;
    try {
      id = crypto.randomUUID();
    } catch {
      setError('Could not create a task ID. Check browser compatibility and try again.');
      return;
    }
    const candidate = addTask(tasks, draft, id);
    if (!candidate.ok) {
      setError(candidate.error);
      return;
    }
    if (persist(candidate.tasks)) setDraft('');
  }

  function complete(id: string) {
    const candidate = completeTask(tasks, id);
    if (candidate.status === 'error') {
      setError(candidate.error);
      return;
    }
    if (candidate.status === 'changed') persist(candidate.tasks);
  }

  function remove(id: string, title: string) {
    if (!tasks.some((task) => task.id === id)) {
      setError('The task is unavailable. Reload and try again.');
      return;
    }
    if (!window.confirm(`Delete "${title}"?`)) return;
    const candidate = deleteTask(tasks, id);
    if (!candidate.ok) {
      setError(candidate.error);
      return;
    }
    persist(candidate.tasks);
  }

  const blocked = !loaded.ok;

  return (
    <main className="app-shell">
      <h1>Personal Task Tracker</h1>
      <form onSubmit={submit}>
        <label htmlFor="task-title">Task title</label>
        <div className="form-row">
          <input id="task-title" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={blocked} />
          <button type="submit" disabled={blocked}>Add task</button>
        </div>
      </form>
      {error && <p className="notice" role="alert">{error}</p>}
      {tasks.length === 0 && !blocked ? <p>No tasks yet. Add a task to get started.</p> : null}
      <ul aria-label="Tasks" className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
            <span className="task-title">{task.title}</span>
            <span className="task-status">{task.completed ? 'Complete' : 'Incomplete'}</span>
            <div className="task-actions">
              {!task.completed && <button type="button" disabled={blocked} onClick={() => complete(task.id)}>Mark {task.title} complete</button>}
              <button type="button" disabled={blocked} onClick={() => remove(task.id, task.title)}>Delete {task.title}</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
