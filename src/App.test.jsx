import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders loading message', () => {
    render(<App />);

    const content = screen.getByText(/Is Loading/i);
    expect(content).toBeInTheDocument();
  });

  it('renders the note editor', async () => {
    render(<App />);

    await waitFor(() => {
      let title;
      const editorTitles = screen.queryAllByTestId('title');
      const editor = screen.getByTestId('editor');

      if (editorTitles.length) {
        title = editorTitles[0];
      }
      expect(title.textContent).toBe('My new note');
      expect(editor).toBeInTheDocument();
    });
  });
});
