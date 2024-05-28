import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Popup from './Popup';
import PopupItem from './PopupItem';

describe('Popup', () => {
  it('renders popup item', () => {
    render(
      <Popup xPos={1} yPos={1}>
        {<PopupItem username="John" />}
      </Popup>
    );

    const username = screen.queryByText(/John/i);

    expect(username).toBeInTheDocument();
  });
});
