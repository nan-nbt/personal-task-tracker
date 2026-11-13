export type Task = { id: string; title: string; completed: boolean };
export type Snapshot = { version: 1; tasks: Task[] };
export type TasksResult = { ok: true; tasks: Task[] } | { ok: false; error: string };

export function isValidTitle(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateTasks(value: unknown): TasksResult {
  if (!Array.isArray(value)) return { ok: false, error: 'Task data must be a list.' };
  const ids = new Set<string>();
  const tasks: Task[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, error: 'A saved task is invalid.' };
    }
    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || candidate.id.trim().length === 0 ||
      !isValidTitle(candidate.title) || typeof candidate.completed !== 'boolean' || ids.has(candidate.id)) {
      return { ok: false, error: 'A saved task is invalid.' };
    }
    ids.add(candidate.id);
    tasks.push({ id: candidate.id, title: candidate.title, completed: candidate.completed });
  }
  return { ok: true, tasks };
}

export function validateSnapshot(value: unknown): TasksResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Saved task data is invalid.' };
  }
  const snapshot = value as Record<string, unknown>;
  if (snapshot.version !== 1) return { ok: false, error: 'Saved task data version is unsupported.' };
  return validateTasks(snapshot.tasks);
}

export function addTask(tasks: Task[], title: string, id: string): TasksResult {
  if (!isValidTitle(title) || typeof id !== 'string' || id.trim().length === 0 || tasks.some((task) => task.id === id)) {
    return { ok: false, error: 'A valid task title and unique ID are required.' };
  }
  return { ok: true, tasks: [...tasks, { id, title, completed: false }] };
}

export type CompleteResult =
  | { status: 'changed'; tasks: Task[] }
  | { status: 'no-op'; tasks: Task[] }
  | { status: 'error'; error: string };

export function completeTask(tasks: Task[], id: string): CompleteResult {
  if (typeof id !== 'string' || id.trim().length === 0) return { status: 'error', error: 'The task is unavailable. Reload and try again.' };
  const index = tasks.findIndex((task) => task.id === id);
  if (index < 0) return { status: 'error', error: 'The task is unavailable. Reload and try again.' };
  if (tasks[index].completed) return { status: 'no-op', tasks };
  return { status: 'changed', tasks: tasks.map((task) => task.id === id ? { ...task, completed: true } : task) };
}

export function deleteTask(tasks: Task[], id: string): TasksResult {
  if (typeof id !== 'string' || id.trim().length === 0 || !tasks.some((task) => task.id === id)) {
    return { ok: false, error: 'The task is unavailable. Reload and try again.' };
  }
  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}
