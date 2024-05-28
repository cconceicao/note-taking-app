import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createNoteAPI, updateNoteAPI } from '../../lib/api';
import {
  NewNote,
  Note,
  PopupPosition,
  SavedNote,
  User,
} from '../../lib/entities';
import {
  debounce,
  getPseudoTagElement,
  getTagElement,
  getUserTagContent,
  getUserTagSuggestions,
  moveCaretAfterTag,
  moveCaretInsidePotentialTag,
  moveCaretToEnd,
} from '../../lib/utils';
import './NoteEditor.css';
import Popup from './../Popup';
import PopupItem from './../Popup/PopupItem';
import SaveStatus from '../SaveStatus';

interface NoteEditorParams {
  isLoading: boolean;
  currentNoteInEditor: Note;
  usernamesList: string[];
  clearNoteEditor: () => void;
  updateEditorWithNote: (note: SavedNote) => void;
  updateEditorWithNewNote: (note: SavedNote) => void;
}

const NoteEditor = ({
  isLoading,
  currentNoteInEditor,
  usernamesList,
  clearNoteEditor,
  updateEditorWithNote,
  updateEditorWithNewNote,
}: NoteEditorParams) => {
  // CURRENT NOTE
  const [currentNote, setCurrentNote] = useState<Note>({ body: '' });
  const [isUpdatingNote, setIsUpdatingNote] = useState<boolean>(false);
  const [isNoteChanged, setIsNoteChanged] = useState<boolean>(false);

  // NOTE ERROR
  const [hasSaveError, sethasSaveError] = useState<boolean>(false);

  // TAG
  const [tagText, setTagText] = useState<string>('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isTagging, setIsTagging] = useState<boolean>(false);

  // SUGGESTIONS POPUP
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({
    x: 0,
    y: 0,
  });
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  // REFS
  const noteEditorRef = useRef<HTMLDivElement>(null!);
  const noteEditorElement = noteEditorRef.current;

  /**
   *
   * MANAGE TAGGING MODE
   *
   */
  const resetTaggingMode = () => {
    setIsTagging(false);
    setTagText('');
    isPopupVisible && setIsPopupVisible(false);
  };

  const stopTaggingMode = () => {
    setIsTagging(false);
    setTagText('');
    // Update caret position
    noteEditorElement.innerHTML += ' ';
    moveCaretAfterTag(noteEditorRef.current);
    moveCaretToEnd(noteEditorRef.current);
  };

  /**
   *
   * UPDATE NOTE
   */
  const createNote = useCallback(
    async (newNote: NewNote) => {
      setIsUpdatingNote(true);

      try {
        const data = await createNoteAPI(newNote);
        setIsUpdatingNote(false);
        updateEditorWithNewNote(data);
      } catch (error) {
        sethasSaveError(true);
        setIsUpdatingNote(false);
      }
    },
    [updateEditorWithNewNote]
  );

  const updateNote = useCallback(
    async (note: Note) => {
      setIsUpdatingNote(true);
      try {
        const data = await updateNoteAPI(note);
        setIsUpdatingNote(false);
        updateEditorWithNote(data);
      } catch (error) {
        setIsUpdatingNote(false);
        sethasSaveError(true);
      }
    },
    [updateEditorWithNote]
  );

  const debouncedSaveNote = useCallback(
    debounce((currentNote: Note) => saveNote(currentNote), 1000),
    []
  );
  /**
   *
   * SAVE NOTE
   */
  const saveNote = useCallback(
    (currentNote: Note) => {
      if (!noteEditorRef?.current?.innerHTML) {
        return;
      }

      if (!currentNote.id) {
        createNote({ body: noteEditorRef.current.innerHTML });
      } else {
        updateNote({
          id: currentNote.id,
          body: noteEditorRef.current.innerHTML,
        });
      }
      !isNoteChanged && setIsNoteChanged(true);
    },
    [createNote, isNoteChanged, updateNote]
  );

  const handleClickSaveNote = () => saveNote(currentNote);

  /**
   *
   * ON INPUT
   */
  const handleOnInput: FormEventHandler<HTMLDivElement> = (e) => {
    const currentNoteText = noteEditorRef.current.textContent;
    const keyEvent = e.nativeEvent as InputEvent;
    const key = keyEvent.data;
    const deleteKey = keyEvent.inputType == 'deleteContentBackward';
    const spaceKey = keyEvent.data === ' ';
    const atKey = keyEvent.data === '@';
    const lastCharBeforeDel = currentNoteText?.charAt(
      currentNoteText?.length - 1
    );
    const isNoteEmpty = currentNoteText === '';

    debouncedSaveNote(currentNote);

    if (isNoteEmpty) {
      isTagging && resetTaggingMode();
    }

    if (deleteKey) {
      if (isTagging) {
        const updatedTagText = tagText.substring(0, tagText.length - 1);
        setTagText(updatedTagText);

        if (lastCharBeforeDel === '@') {
          setIsTagging(false);
        }
      }
    }

    if (spaceKey) {
      if (isTagging) {
        const username = getUserTagContent({
          text: tagText.substring(1, tagText.length),
          usernames: usernamesList,
        });

        if (username) {
          addUserTagToNote({ username });
        } else {
          stopTaggingMode();
        }
        setIsPopupVisible(false);
      }
    }

    if (atKey) {
      addPseudoTagElement();
    }

    if (!deleteKey && !spaceKey && !atKey && isTagging && key) {
      setTagText(tagText.concat('', key));
    }
  };

  /**
   *
   * ADD USER TAG
   */
  const addUserTagToNote = ({ username }: User) => {
    if (!username) {
      return;
    }
    const tagElements = noteEditorElement.getElementsByTagName('span');

    if (tagElements.length > 0) {
      const lastTagElement = tagElements[tagElements.length - 1];
      const tagElement = getTagElement({ username });

      noteEditorElement.removeChild(lastTagElement);
      noteEditorElement.appendChild(tagElement);

      noteEditorElement.innerHTML += ' ';

      moveCaretAfterTag(noteEditorRef.current);
    }
  };

  const handleClickUserSuggestion = (e: React.MouseEvent<HTMLElement>) => {
    const username = (e.target as HTMLElement).dataset.username;
    if (username) {
      addUserTagToNote({ username });
      resetTaggingMode();
      saveNote(currentNote);
    }
  };

  /**
   *
   * ADD USER PSEUDO TAG
   */
  const addPseudoTagElement = () => {
    const content = noteEditorElement.innerHTML;
    const contentBeforeTag = content
      .substring(0, content.length - 1)
      .concat(' ');
    const pseudoTagElement = getPseudoTagElement();

    noteEditorElement.innerHTML = contentBeforeTag;
    noteEditorElement.appendChild(pseudoTagElement);

    moveCaretInsidePotentialTag({ element: pseudoTagElement });
    setIsTagging(true);
    setIsPopupVisible(true);
  };

  /**
   *
   * UPDATE SUGGESTIONS LIST
   */
  useEffect(() => {
    if (!isTagging || !usernamesList) {
      return;
    } else {
      const updatedSuggestions = getUserTagSuggestions({
        usernames: usernamesList,
        searchTerm: tagText,
      });
      setTagSuggestions(updatedSuggestions);
    }
  }, [isTagging, tagText, usernamesList]);

  /**
   *
   * UPDATE CURRENT NOTE
   */
  useEffect(() => {
    const editor = noteEditorRef.current;

    if (editor && currentNoteInEditor) {
      setCurrentNote(currentNoteInEditor);
      editor.innerHTML = currentNoteInEditor.body;
    }
  }, [noteEditorRef, currentNoteInEditor]);

  useEffect(() => {
    setIsNoteChanged(false);
  }, [currentNoteInEditor]);

  /**
   *
   * POPUP: UPDATE POSITION
   */
  const getSpanCoordinates = (element: Element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      };
    }
  };

  useEffect(() => {
    if (isTagging) {
      const editor = document.getElementById('editor');
      const tagElements = editor?.getElementsByClassName('pseudoTag');
      const element = tagElements && tagElements[tagElements?.length - 1];

      if (!element) {
        return;
      }
      const pos = getSpanCoordinates(element);
      pos && setPopupPosition({ x: pos.x, y: pos.y });
    }
  }, [isTagging]);

  /**
   *
   * POPUP: HIDE IF CLICKED OUT OF EDITOR
   */
  const handleClickInDoc = useCallback(
    (e: MouseEvent) => {
      const isPopUpSuggestion = !!(e.target as HTMLElement).dataset.id;

      if (isPopupVisible && !isPopUpSuggestion) {
        setIsPopupVisible(false);
      }
    },
    [isPopupVisible]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickInDoc);
    return () => {
      document.removeEventListener('click', handleClickInDoc);
    };
  }, [handleClickInDoc, isPopupVisible]);

  if (isLoading) {
    return <div>Is Loading</div>;
  }

  console.log('tagSuggestions', tagSuggestions, isPopupVisible);
  return (
    <>
      <div className="group flex items-center mb-8">
        <h2 data-testid="title" className="flex-1 text-2xl font-bold">
          My new note
        </h2>
        <button
          onClick={clearNoteEditor}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            className="inline w-4 h-4 me-3 text-white"
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
          Create new note
        </button>
      </div>

      <div data-testid="editor">
        <div
          id="editor"
          data-testid={currentNote.body}
          ref={noteEditorRef}
          contentEditable={!isLoading}
          className={`${
            isTagging ? 'is-tagging' : ''
          } editor border rounded-xl`}
          onInput={handleOnInput}
        ></div>

        {isNoteChanged && !isUpdatingNote && (
          <SaveStatus
            isUpdating={isUpdatingNote}
            hasError={hasSaveError}
            handleSaveNote={handleClickSaveNote}
          />
        )}

        {isPopupVisible && tagSuggestions?.length > 0 && (
          <Popup xPos={popupPosition.x} yPos={popupPosition.y}>
            {tagSuggestions.slice(0, 5).map((username) => {
              console.log('usernnn', popupPosition);
              return (
                <PopupItem
                  key={username}
                  username={username}
                  onClick={handleClickUserSuggestion}
                />
              );
            })}
          </Popup>
        )}
      </div>
    </>
  );
};

export default NoteEditor;
