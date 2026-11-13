import { describe, expect, it } from 'vitest';
import { addTask, completeTask, deleteTask, isValidTitle, validateSnapshot } from './tasks';

describe('task validation', () => {
  it.each(['', '   ', '\t', '\n', ' \t\n '])('rejects whitespace-only title %j', (title) => {
    expect(isValidTitle(title)).toBe(false);
  });

  it('accepts valid titles without changing their original text', () => {
    const title = '  Buy groceries  ';
    expect(isValidTitle(title)).toBe(true);
    expect(validateSnapshot({ version: 1, tasks: [{ id: 'one', title, completed: false }] })).toEqual({
      ok: true,
      tasks: [{ id: 'one', title, completed: false }],
    });
  });

  it.each([
    null,
    [],
    'snapshot',
    { version: '1', tasks: [] },
    { version: 1, tasks: {} },
    { version: 2, tasks: [] },
    { version: 1, tasks: [null] },
    { version: 1, tasks: [{ id: '', title: 'Valid', completed: false }] },
    { version: 1, tasks: [{ id: '  ', title: 'Valid', completed: false }] },
    { version: 1, tasks: [{ id: 'one', title: ' \n ', completed: false }] },
    { version: 1, tasks: [{ id: 'one', title: 'Valid', completed: 0 }] },
    { version: 1, tasks: [{ id: 'one', title: 'Valid', completed: false }, { id: 'one', title: 'Other', completed: true }] },
  ])('rejects invalid complete snapshot %j', (snapshot) => {
    expect(validateSnapshot(snapshot)).toMatchObject({ ok: false });
  });

  it('rejects the whole payload when one member is invalid', () => {
    expect(validateSnapshot({ version: 1, tasks: [
      { id: 'valid', title: 'Valid', completed: false },
      { id: 'invalid', title: '', completed: false },
    ] })).toMatchObject({ ok: false });
  });

  it('copies only recognized fields and permits extra fields', () => {
    expect(validateSnapshot({ version: 1, extra: true, tasks: [{
      id: 'one', title: 'Valid', completed: false, extra: 'ignored',
    }] })).toEqual({ ok: true, tasks: [{ id: 'one', title: 'Valid', completed: false }] });
  });

  it('adds an immutable task candidate with a valid unique ID', () => {
    const initial = [{ id: 'first', title: 'First', completed: false }];
    const result = addTask(initial, '  Next  ', 'second');
    expect(result).toEqual({ ok: true, tasks: [...initial, { id: 'second', title: '  Next  ', completed: false }] });
    expect(result.ok && result.tasks).not.toBe(initial);
    expect(initial).toHaveLength(1);
  });

  it.each([
    { tasks: [], id: '' },
    { tasks: [], id: '  ' },
    { tasks: [{ id: 'first', title: 'Existing', completed: false }], id: 'first' },
  ])('rejects invalid or colliding new ID $id', ({ tasks, id }) => {
    expect(addTask(tasks, 'Task', id)).toMatchObject({ ok: false });
  });

  it('permits duplicate titles and preserves insertion order', () => {
    expect(addTask([{ id: 'first', title: 'Same', completed: false }], 'Same', 'second'))
      .toMatchObject({ ok: true, tasks: [{ id: 'first' }, { id: 'second', title: 'Same' }] });
  });

  it('accepts Unicode titles without changing them', () => {
    expect(addTask([], '買い物 🛒', 'unicode')).toEqual({
      ok: true,
      tasks: [{ id: 'unicode', title: '買い物 🛒', completed: false }],
    });
  });

  it('allows deleting the final task to produce a valid empty list', () => {
    expect(deleteTask([{ id: 'last', title: 'Last', completed: true }], 'last'))
      .toEqual({ ok: true, tasks: [] });
  });

  it('completes only the selected task without changing its peers or input', () => {
    const tasks = [
      { id: 'first', title: 'One', completed: false },
      { id: 'second', title: 'Two', completed: false },
    ];
    expect(completeTask(tasks, 'second')).toMatchObject({ status: 'changed', tasks: [tasks[0], { ...tasks[1], completed: true }] });
    expect(tasks[1].completed).toBe(false);
  });

  it.each(['missing', '  '])('rejects unavailable completion target %j', (id) => {
    expect(completeTask([], id)).toMatchObject({ status: 'error' });
  });

  it('treats already completed task as a no-op', () => {
    const tasks = [{ id: 'one', title: 'One', completed: true }];
    expect(completeTask(tasks, 'one')).toMatchObject({ status: 'no-op', tasks });
  });

  it('deletes only the selected ID preserving peer fields and order', () => {
    const tasks = [
      { id: 'first', title: 'Same', completed: false },
      { id: 'second', title: 'Same', completed: true },
      { id: 'third', title: 'Other', completed: false },
    ];
    expect(deleteTask(tasks, 'second')).toEqual({ ok: true, tasks: [tasks[0], tasks[2]] });
    expect(tasks).toHaveLength(3);
  });

  it('rejects unavailable deletion targets', () => {
    expect(deleteTask([], 'missing')).toMatchObject({ ok: false });
  });
});
