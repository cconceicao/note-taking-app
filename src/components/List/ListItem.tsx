import { MouseEventHandler } from 'react';
import './ListItem.css';

const ListItem = ({
  id,
  content,
  handleClick,
  isCurrentNote,
}: {
  id: number;
  content: string;
  handleClick: MouseEventHandler<HTMLLIElement>;
  isCurrentNote: boolean;
}) => {
  return (
    <li
      data-note-id={id}
      data-testid="notesListItem"
      className={`${
        isCurrentNote ? 'isCurrentNote' : ''
      } listItem cursor-pointer hover:bg-neutral-100 group relative mb-1 text-neutral-600 hover:text-neutral-950 bg-white border shadow-sm rounded-xl transition`}
      onClick={handleClick}
    >
      <div
        data-testid="notesListItemContent"
        className="note pointer-events-none p-4 md:p-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {!isCurrentNote && (
        <div data-testid="editButton" className="actions pointer-events-none">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <svg
              className="h-5 w-5 text-neutral-600"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {' '}
              <path stroke="none" d="M0 0h24v24H0z" />{' '}
              <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />{' '}
              <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
            </svg>
          </div>
        </div>
      )}

      {/* DELETE BTN - API NOT READY YET
      <button
        type='button'
        onClick={handleDelete}
        className='w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-100'>
        <svg className="h-5 w-5 text-neutral-600" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 3v4a1 1 0 0 0 1 1h4" />  <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="6" y1="16" x2="6" y2="18" />  <line x1="10" y1="16" x2="10" y2="22" />  <line x1="14" y1="16" x2="14" y2="18" />  <line x1="18" y1="16" x2="18" y2="20" /></svg>
      </button> */}
    </li>
  );
};

export default ListItem;
