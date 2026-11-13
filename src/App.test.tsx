import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import App from './App';
import { STORAGE_KEY } from './taskStorage';

const seed = (tasks: Array<{ id: string; title: string; completed: boolean }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks }));
};
const taskRows = () => screen.getAllByRole('listitem');

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe('personal task tracker', () => {
  it('renders a fresh list and adds a labeled valid task', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Personal Task Tracker' })).toBeInTheDocument();
    expect(screen.getByText('No tasks yet. Add a task to get started.')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Task title' }), 'Buy groceries');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in|share/i })).not.toBeInTheDocument();
  });

  it('rejects whitespace without storage changes and renders titles as text', async () => {
    const user = userEvent.setup();
    seed([{ id: 'existing', title: 'Existing', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Task title' });
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a task title containing at least one non-whitespace character');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(write).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, '<img src=x onerror=alert(1)>');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('reports ID generation failure without changing draft, list, or storage', async () => {
    const user = userEvent.setup();
    seed([{ id: 'existing', title: 'Existing', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => { throw new Error('unavailable'); });
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Task title' });
    await user.type(input, 'Keep my draft');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not create a task ID');
    expect(input).toHaveValue('Keep my draft');
    expect(taskRows()).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('preserves draft and list after a failed add', async () => {
    const user = userEvent.setup();
    seed([{ id: 'existing', title: 'Existing', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('denied'); });
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Task title' });
    await user.type(input, 'Do not lose draft');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save this change');
    expect(input).toHaveValue('Do not lose draft');
    expect(taskRows()).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('completes a task, retains it and restores it after remount without reversal action', async () => {
    const user = userEvent.setup();
    seed([{ id: 'one', title: 'Finish report', completed: false }]);
    const first = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Mark Finish report complete' }));
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /incomplete/i })).not.toBeInTheDocument();
    first.unmount();
    render(<App />);
    expect(screen.getByText('Finish report')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('does not display completion or replace saved bytes when completing save fails', async () => {
    const user = userEvent.setup();
    seed([{ id: 'one', title: 'Finish report', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('denied'); });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Mark Finish report complete' }));
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save this change');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('prompts for deletion; cancellation makes no changes, confirmation deletes only selected ID', async () => {
    const user = userEvent.setup();
    seed([
      { id: 'one', title: 'Duplicate', completed: false },
      { id: 'two', title: 'Duplicate', completed: true },
    ]);
    const raw = localStorage.getItem(STORAGE_KEY);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: 'Delete Duplicate' })[0]);
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Duplicate'));
    expect(taskRows()).toHaveLength(2);
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    confirm.mockReturnValue(true);
    await user.click(screen.getAllByRole('button', { name: 'Delete Duplicate' })[1]);
    expect(taskRows()).toHaveLength(1);
    expect(within(taskRows()[0]).getByText('Duplicate')).toBeInTheDocument();
    expect(within(taskRows()[0]).getByText('Incomplete')).toBeInTheDocument();
  });

  it('keeps cancelled task and confirmed deletion outcome after remount', async () => {
    const user = userEvent.setup();
    seed([
      { id: 'cancelled', title: 'Keep this task', completed: true },
      { id: 'deleted', title: 'Remove this task', completed: false },
    ]);
    let rawDuringPrompt = '';
    vi.spyOn(window, 'confirm').mockImplementation(() => {
      rawDuringPrompt = localStorage.getItem(STORAGE_KEY) ?? '';
      expect(taskRows()).toHaveLength(2);
      return false;
    });
    const firstRender = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Delete Keep this task' }));
    expect(rawDuringPrompt).toBe(localStorage.getItem(STORAGE_KEY));
    vi.mocked(window.confirm).mockReturnValue(true);
    await user.click(screen.getByRole('button', { name: 'Delete Remove this task' }));
    expect(taskRows()).toHaveLength(1);
    firstRender.unmount();
    render(<App />);
    expect(taskRows()).toHaveLength(1);
    expect(screen.getByText('Keep this task')).toBeInTheDocument();
    expect(screen.queryByText('Remove this task')).not.toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('keeps a confirmed deletion visible after save failure', async () => {
    const user = userEvent.setup();
    seed([{ id: 'one', title: 'Keep on failure', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('denied'); });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Delete Keep on failure' }));
    expect(screen.getByText('Keep on failure')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save this change');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('shows mixed completed and incomplete tasks and allows duplicate titles', async () => {
    const user = userEvent.setup();
    seed([
      { id: 'one', title: 'Same title', completed: false },
      { id: 'two', title: 'Same title', completed: true },
    ]);
    render(<App />);
    expect(taskRows()).toHaveLength(2);
    expect(within(taskRows()[0]).getByText('Incomplete')).toBeInTheDocument();
    expect(within(taskRows()[1]).getByText('Complete')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Task title' }), 'Same title');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(taskRows()).toHaveLength(3);
  });

  it('retains a completed task when its deletion is cancelled', async () => {
    const user = userEvent.setup();
    seed([{ id: 'done', title: 'Completed task', completed: true }]);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Delete Completed task' }));
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Completed task'));
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(write).not.toHaveBeenCalled();
  });

  it('clears a save error after a later successful retry', async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('denied'); });
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Task title' });
    await user.type(input, 'Retry me');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save this change');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Retry me')).toBeInTheDocument();
  });

  it('reports a storage getter error without allowing mutations', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new Error('denied'); });
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved tasks could not be loaded');
    expect(screen.getByRole('button', { name: 'Add task' })).toBeDisabled();
    expect(write).not.toHaveBeenCalled();
  });

  it('reads valid storage in StrictMode without writing or removing it', () => {
    seed([{ id: 'valid', title: 'Saved task', completed: false }]);
    const raw = localStorage.getItem(STORAGE_KEY);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    render(<StrictMode><App /></StrictMode>);
    expect(screen.getByText('Saved task')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(write).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it('blocks mutations after invalid load and never writes during StrictMode mounts', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    const raw = localStorage.getItem(STORAGE_KEY);
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    render(<StrictMode><App /></StrictMode>);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved tasks could not be loaded');
    expect(screen.getByRole('button', { name: 'Add task' })).toBeDisabled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    expect(write).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});
