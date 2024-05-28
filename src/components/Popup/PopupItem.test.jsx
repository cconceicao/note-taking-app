import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PopupItem from './PopupItem';

describe('PopupItem', () => {
  it('renders PopupItem item', () => {
    render(<PopupItem username="John" />);

    const username = screen.queryByText(/John/i);

    expect(username).toBeInTheDocument();
  });
});
