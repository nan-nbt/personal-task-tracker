import { validateSnapshot, validateTasks, type Task, type TasksResult } from './tasks';

export const STORAGE_KEY = 'task-tracker.tasks';
export type SaveResult = { ok: true } | { ok: false; error: string };

export function loadTasks(): TasksResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, tasks: [] };
    const result = validateSnapshot(JSON.parse(raw) as unknown);
    if (!result.ok) {
      return { ok: false, error: 'Saved tasks could not be loaded; no saved data was changed. Resolve the storage problem and reload.' };
    }
    return result;
  } catch {
    return { ok: false, error: 'Saved tasks could not be loaded; no saved data was changed. Resolve the storage problem and reload.' };
  }
}

export function saveTasks(tasks: Task[]): SaveResult {
  const validated = validateTasks(tasks);
  if (!validated.ok) return { ok: false, error: 'Could not save this change. Your saved tasks were not changed; check browser storage and try again.' };
  try {
    const serialized = JSON.stringify({ version: 1, tasks: validated.tasks });
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save this change. Your saved tasks were not changed; check browser storage and try again.' };
  }
}
