import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockNotesList } from '../../../mocks/data';
import List from './List';

describe('List', () => {
  it('renders empty list', () => {
    render(<List notes={[]} />);

    const list = screen.queryByTestId('notesList');
    const emptyListText = screen.queryByText(/You have no notes, yet./i);

    expect(list).toBeInTheDocument();
    expect(emptyListText).toBeInTheDocument();
  });

  it('renders notes', () => {
    render(<List notes={mockNotesList} />);

    const notesListItems = screen.queryAllByTestId('notesListItem');

    expect(notesListItems.length).toBe(2);
  });

  it('sorts items', () => {
    render(<List notes={mockNotesList} />);

    const notesListItems = screen.queryAllByTestId('notesListItemContent');
    const note_1 = notesListItems[0];
    const note_2 = notesListItems[1];
    const sortButton = screen.queryByTestId('sortButton');

    expect(note_1.innerHTML).toBe('note0');
    expect(note_2.innerHTML).toBe('note1');
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);

    expect(screen.queryAllByTestId('notesListItemContent')[0].innerHTML).toBe(
      'note1'
    );
  });

  it('highlights current note in editor', () => {
    render(<List notes={mockNotesList} currentNoteId={0} />);

    const currentNoteInEditor = screen.queryAllByTestId('notesListItem')[0];

    expect(currentNoteInEditor).toHaveClass('isCurrentNote');
  });
});
