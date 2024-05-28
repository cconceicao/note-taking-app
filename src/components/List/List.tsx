import { useCallback, useState } from 'react';
import { SavedNote } from '../../lib/entities';
import ListItem from './ListItem';

interface ListParams {
  notes: SavedNote[];
  currentNoteId?: number;
  editNote: (id: number) => void;
}

const List = ({ notes, currentNoteId, editNote }: ListParams) => {
  const [ascending, setAscending] = useState(true);

  const toggleListSort = useCallback(
    () => setAscending(!ascending),
    [ascending]
  );

  const handleClickNote = useCallback(
    (note: React.MouseEvent<HTMLElement>) => {
      const noteId = (note.target as HTMLButtonElement).dataset.noteId;
      editNote(Number(noteId));
    },
    [editNote]
  );

  const sortedNotesDesc = notes && [...notes].sort((a, b) => b.id - a.id);
  const notesListed = ascending ? notes : sortedNotesDesc;

  if (!notes || notes.length === 0) {
    return (
      <div data-testid="notesList" className="group flex flex-col">
        <h2 data-testid="title" className="flex-1 mb-8 text-2xl font-bold">
          My notes
        </h2>
        <div className="flex flex-col items-center content-center text-md text-center">
          <svg
            className="h-8 w-8 mb-2 text-neutral-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p className="text-neutral-700 mt-2">You have no notes, yet.</p>
          <p className="text-neutral-500">
            Create your first note on the text editor on the left.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div data-testid="notesList" className="group flex items-center mb-8">
        <h2 data-testid="title" className="flex-1 text-2xl font-bold">
          My notes
        </h2>
        <div className="flex items-center text-neutral-500">
          <span className="text-xs">
            {ascending ? 'Ascending' : 'Descending'}
          </span>
          <button
            type="button"
            data-testid="sortButton"
            onClick={toggleListSort}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          >
            <svg
              className={`${
                !ascending && 'rotate-180'
              } h-5 w-5 text-neutral-600 hover:text-neutral-800`}
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {' '}
              <path stroke="none" d="M0 0h24v24H0z" />{' '}
              <line x1="4" y1="6" x2="13" y2="6" />{' '}
              <line x1="4" y1="12" x2="11" y2="12" />{' '}
              <line x1="4" y1="18" x2="11" y2="18" />{' '}
              <polyline points="15 15 18 18 21 15" />{' '}
              <line x1="18" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div data-testid="notesList" className="overflow-x-scroll">
        <ul className="pb-4">
          {notesListed.map(({ id, body }, i) => {
            return (
              <ListItem
                key={i}
                id={id}
                content={body}
                handleClick={handleClickNote}
                isCurrentNote={id === currentNoteId}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default List;
