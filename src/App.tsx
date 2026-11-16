import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import { addTask, completeTask, deleteTask, isValidTitle, type Task } from './tasks';
import { loadTasks, saveTasks } from './taskStorage';

type TaskActionButtonProps = {
  name: string;
  tip: string;
  icon: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

function TaskActionButton({ name, tip, icon, disabled, onClick }: TaskActionButtonProps) {
  const tooltipId = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = (hovered || focused) && !dismissed;

  useEffect(() => {
    if (!hovered && !focused && dismissed) setDismissed(false);
  }, [hovered, focused, dismissed]);

  return (
    <span
      className="task-action"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && visible) {
          event.preventDefault();
          event.stopPropagation();
          setDismissed(true);
        }
      }}
    >
      <button
        type="button"
        className="task-action-button"
        aria-label={name}
        aria-describedby={visible ? tooltipId : undefined}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </button>
      {visible && <span id={tooltipId} className="task-action-tooltip" role="tooltip">{tip}</span>}
    </span>
  );
}

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
            <div className="task-actions">
              {!task.completed && (
                <TaskActionButton
                  name={`Mark ${task.title} complete`}
                  tip="Mark as complete"
                  icon={<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6" /></svg>}
                  disabled={blocked}
                  onClick={() => complete(task.id)}
                />
              )}
              <TaskActionButton
                name={`Delete ${task.title}`}
                tip="Delete task"
                icon={<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>}
                disabled={blocked}
                onClick={() => remove(task.id, task.title)}
              />
            </div>
            <span className="task-title">{task.title}</span>
            <span className="task-status">{task.completed ? 'Complete' : 'Incomplete'}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
