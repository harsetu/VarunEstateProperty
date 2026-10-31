import { useCallback, useEffect, useState } from 'react';
import type { Note } from '@/domain/note';
import { notesRepository } from '@/app/container';

export function useNotesViewModel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);

  const refresh = useCallback(() => notesRepository.list().then(setNotes), []);
  useEffect(() => { refresh(); }, [refresh]);

  const startNew = () => setEditing({ id: `n-${Date.now().toString(36)}`, title: '', body: '', updatedAt: Date.now() });
  const change = (patch: Partial<Note>) => setEditing((n) => (n ? { ...n, ...patch } : n));

  const save = async () => {
    if (!editing || (!editing.title.trim() && !editing.body.trim())) return;
    await notesRepository.save({ ...editing, updatedAt: Date.now() });
    setEditing(null);
    refresh();
  };
  const remove = async (id: string) => {
    await notesRepository.remove(id);
    if (editing?.id === id) setEditing(null);
    refresh();
  };

  return { notes, editing, startNew, edit: setEditing, cancel: () => setEditing(null), change, save, remove };
}
