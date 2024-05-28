import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ListItem from './ListItem';

describe('ListItem', () => {
  it('renders default ListItem', () => {
    render(<ListItem id={0} content={'Note content'} isCurrentNote={false} />);

    const item = screen.queryByTestId('notesListItem');
    const itemContent = screen.findByText('Note content');
    const itemEditBtn = screen.queryByTestId('editButton');

    expect(item).toBeInTheDocument();
    expect(itemContent).to.exist;
    expect(itemEditBtn).toBeInTheDocument();

    screen.debug();
  });

  it('renders selected ListItem', () => {
    render(
      <ListItem id={0} content={'Selected note content'} isCurrentNote={true} />
    );

    const item = screen.queryByTestId('notesListItem');
    const itemEditBtn = screen.queryByTestId('editButton');

    expect(item).toHaveClass('isCurrentNote');
    expect(itemEditBtn).not.toBeInTheDocument();
  });
});
