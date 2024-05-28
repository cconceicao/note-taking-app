import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { mockNotesList } from '../../../mocks/data';
import NoteEditor from './NoteEditor';

describe('NoteEditor', () => {
  it('renders `Is Loading`', async () => {
    render(<NoteEditor isLoading={true} />);

    const editor = screen.queryByTestId('editor');
    const editorTitle = screen.queryByText('Is Loading');

    expect(editor).not.toBeInTheDocument();
    expect(editorTitle).toBeInTheDocument();
  });

  it('renders note editor', async () => {
    const currentNoteInEditor = mockNotesList[0];

    await act(async () => {
      render(
        <NoteEditor
          isLoading={false}
          currentNoteInEditor={currentNoteInEditor}
        />
      );
    });

    await waitFor(() => {
      const editor = screen.queryByTestId('editor');
      const noteTextInEditor = screen.queryByText(currentNoteInEditor.body);

      expect(editor).toBeInTheDocument();
      expect(noteTextInEditor).toBeInTheDocument();
    });
  });
});
