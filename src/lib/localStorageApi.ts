const NOTE_ID_LOCAL_STORAGE_KEY = 'noteId';

const setNoteId = (id: number) => {
  if (id === undefined || id === null) {
    return;
  }

  localStorage.setItem(NOTE_ID_LOCAL_STORAGE_KEY, String(id));
};

const resetNoteId = () => {
  localStorage.setItem(NOTE_ID_LOCAL_STORAGE_KEY, '');
};

const getNoteId = (): number | null => {
  const data = localStorage.getItem(NOTE_ID_LOCAL_STORAGE_KEY);

  if (data) {
    return Number(data);
  }

  return null;
};

export const localStorageAPI = {
  setNoteId,
  getNoteId,
  resetNoteId,
};
