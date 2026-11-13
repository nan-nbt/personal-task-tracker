import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadTasks, saveTasks, STORAGE_KEY } from './taskStorage';
import type { Task } from './tasks';

const validTask: Task = { id: 'one', title: 'Task', completed: false };

beforeEach(() => localStorage.clear());

describe('task storage', () => {
  it.each([{ tasks: [] }, { tasks: [validTask, { ...validTask, id: 'two', completed: true }] }])('round-trips a valid list $tasks without writing on load', ({ tasks }) => {
    expect(saveTasks(tasks)).toEqual({ ok: true });
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    expect(loadTasks()).toEqual({ ok: true, tasks });
    expect(write).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it.each([
    { tasks: [validTask, { ...validTask, id: 'two', title: '' }] },
    { tasks: [validTask, validTask] },
  ])('rejects every invalid member or duplicate ID $tasks', ({ tasks }) => {
    const raw = JSON.stringify({ version: 1, tasks });
    localStorage.setItem(STORAGE_KEY, raw);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    expect(loadTasks().ok).toBe(false);
    expect(saveTasks(tasks).ok).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(write).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it('catches storage read failure without writing', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => { throw new Error('denied'); });
    expect(loadTasks().ok).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it('catches storage getter failure at call time', () => {
    localStorage.setItem(STORAGE_KEY, 'previous');
    const storage = window.localStorage;
    const write = vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new Error('denied'); });
    expect(loadTasks().ok).toBe(false);
    expect(saveTasks([validTask]).ok).toBe(false);
    expect(write).not.toHaveBeenCalled();
    expect(storage.getItem(STORAGE_KEY)).toBe('previous');
  });

  it('preserves saved bytes on serialization failure', () => {
    localStorage.setItem(STORAGE_KEY, 'previous');
    const write = vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(JSON, 'stringify').mockImplementationOnce(() => { throw new Error('failed'); });
    expect(saveTasks([validTask]).ok).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('previous');
    expect(write).not.toHaveBeenCalled();
  });
  it('loads missing storage as a fresh empty list without writing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    expect(loadTasks()).toEqual({ ok: true, tasks: [] });
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).not.toHaveBeenCalled();
  });

  it.each(['', 'null', '{', '{"version":2,"tasks":[]}'])('rejects corrupt raw value %j without changing it', (raw) => {
    localStorage.setItem(STORAGE_KEY, raw);
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    expect(loadTasks()).toMatchObject({ ok: false });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).not.toHaveBeenCalled();
  });

  it('round-trips validated tasks and leaves unrelated keys alone', () => {
    localStorage.setItem('other', 'untouched');
    expect(saveTasks([validTask])).toEqual({ ok: true });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ version: 1, tasks: [validTask] }));
    expect(loadTasks()).toEqual({ ok: true, tasks: [validTask] });
    expect(localStorage.getItem('other')).toBe('untouched');
  });

  it('does not alter the previous value when storage writes fail', () => {
    localStorage.setItem(STORAGE_KEY, 'previous');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('denied'); });
    expect(saveTasks([validTask])).toMatchObject({ ok: false });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('previous');
  });
});
