import type { Note } from '@/domain/note';
import type { NotesRepository } from '@/domain/repositories/AdminRepositories';

/** Notes kept in this browser only. Swap for an API-backed repository when the backend has notes. */
export class LocalNotesRepository implements NotesRepository {
  constructor(private readonly key: string) {}

  private read(): Note[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) ?? '[]');
    } catch {
      return [];
    }
  }
  private write(notes: Note[]) {
    try { localStorage.setItem(this.key, JSON.stringify(notes)); } catch { /* storage blocked */ }
  }

  list = async () => this.read().sort((a, b) => b.updatedAt - a.updatedAt);

  save = async (note: Note) => {
    this.write([...this.read().filter((n) => n.id !== note.id), note]);
  };

  remove = async (id: string) => {
    this.write(this.read().filter((n) => n.id !== id));
  };
}
