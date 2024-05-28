import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchNotes, fetchUsers } from './lib/api';
import { NewNote, Note, SavedNote, User } from './lib/entities';
import { localStorageAPI } from './lib/localStorageApi';
import List from './components/List';
import NoteEditor from './components/NoteEditor';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<SavedNote[]>();
  const [currentNoteInEditor, setEditorCurrentNote] = useState<Note | NewNote>({
    body: '',
  });

  const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);
  const [isFetchingNotes, setIsFetchingNotes] = useState<boolean>(false);
  const [isEditorPopulated, setIsEditorPopulated] = useState<boolean>(false);

  const getUsers = useCallback(async () => {
    setIsFetchingUsers(true);

    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setIsFetchingUsers(false);
    } catch (error) {
      setIsFetchingUsers(false);
    }
  }, []);

  const getAllNotes = useCallback(async () => {
    setIsFetchingNotes(true);

    try {
      const notes = await fetchNotes();
      setNotes(notes);
      setIsFetchingNotes(false);
    } catch (error) {
      setIsFetchingNotes(false);
    }
  }, []);

  const clearNoteEditor = () => {
    localStorageAPI.resetNoteId();
    setEditorCurrentNote({ body: '' });
    setIsEditorPopulated(true);
  };

  const updateNoteInLStorage = useCallback((id: number) => {
    localStorageAPI.setNoteId(id);
  }, []);

  const updateNotesList = useCallback(
    (note: SavedNote) => {
      if (!notes) {
        return;
      }
      setNotes((prevNotes) => {
        if (!prevNotes) {
          return [note];
        }

        const isFirstNote = prevNotes.length === 0;
        const isExistingNote =
          prevNotes.find((n) => n.id === note.id) !== undefined;

        if (isFirstNote) {
          return [note];
        }

        if (isExistingNote) {
          return prevNotes.map((n) => (n.id === note.id ? note : n));
        } else {
          return [...prevNotes, note];
        }
      });
    },
    [notes]
  );

  const updateEditorWithNewNote = useCallback(
    (note: SavedNote) => {
      updateNoteInLStorage(note.id);
      setEditorCurrentNote(note);
      setIsEditorPopulated(true);
      updateNotesList(note);
    },
    [updateNoteInLStorage, updateNotesList]
  );

  const updateCurrentNoteInEditor = useCallback(
    (id: number) => {
      const storagedNote = notes?.find((note) => note.id == id);

      if (!storagedNote) {
        throw new Error(`Note ${id} not found`);
      }

      setIsEditorPopulated(false);
      updateNoteInLStorage(id);
      setEditorCurrentNote(storagedNote);
    },
    [notes, updateNoteInLStorage]
  );

  useEffect(() => {
    getUsers();
    getAllNotes();
  }, [getAllNotes, getUsers]);

  /**
   * Update note in editor
   */
  useEffect(() => {
    if (isEditorPopulated) {
      return;
    }

    const isLoading = isFetchingNotes || (!isFetchingNotes && !notes);

    if (!isLoading) {
      const storagedNoteId = localStorageAPI.getNoteId();
      const hasNotes = notes && notes.length > 0;
      const storagedNote =
        hasNotes && notes.find((note) => note.id == storagedNoteId);

      if (storagedNote) {
        setEditorCurrentNote(storagedNote);
        setIsEditorPopulated(true);
        return;
      }

      if (hasNotes) {
        const lastNoteFromList = notes[notes.length - 1];
        setEditorCurrentNote(lastNoteFromList);
        setIsEditorPopulated(true);
        return;
      }

      localStorageAPI.resetNoteId();
      setEditorCurrentNote({ body: '' });
      setIsEditorPopulated(true);
    }
  }, [isEditorPopulated, isFetchingNotes, notes]);

  const getUsernamesList = useMemo(
    () => users.map((user) => user.username),
    [users]
  );
  const colClassNames = 'flex flex-col p-6';

  if (isFetchingNotes || (!isFetchingNotes && !notes)) {
    return <div id="app">App is loading</div>;
  }

  return (
    <div id="app" className="flex h-full p-4">
      <div className={`${colClassNames} flex-1`}>
        <NoteEditor
          isLoading={isFetchingNotes}
          currentNoteInEditor={currentNoteInEditor}
          clearNoteEditor={clearNoteEditor}
          updateEditorWithNote={updateNotesList}
          updateEditorWithNewNote={updateEditorWithNewNote}
          usernamesList={isFetchingUsers ? [] : getUsernamesList}
        />
      </div>

      {notes && (
        <div
          className={`${colClassNames} pb-0 bg-gray-50 rounded-xl`}
          style={{ width: '20rem' }}
        >
          <List
            notes={notes}
            editNote={updateCurrentNoteInEditor}
            currentNoteId={currentNoteInEditor.id}
          />
        </div>
      )}
    </div>
  );
}

export default App;
