import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SaveSatus from './SaveStatus';

describe('SaveSatus', () => {
  it('renders saving message', () => {
    render(<SaveSatus isUpdating={true} hasError={false} />);

    const status = screen.queryByTestId('saveSatus');
    const savingIcon = screen.queryByTestId('savingIcon');
    const savingText = screen.queryByText(/Saving.../i);

    expect(status).toBeInTheDocument();
    expect(savingIcon).toBeInTheDocument();
    expect(savingText).toBeInTheDocument();
  });

  it('renders success message', () => {
    render(<SaveSatus isUpdating={false} hasError={false} />);

    const status = screen.queryByTestId('saveSatus');
    const successIcon = screen.queryByTestId('successIcon');
    const successText = screen.queryByText(/Saved/i);

    expect(status).toBeInTheDocument();
    expect(successIcon).toBeInTheDocument();
    expect(successText).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<SaveSatus isUpdating={false} hasError={true} />);

    const status = screen.queryByTestId('saveSatus');
    const errorIcon = screen.queryByTestId('errorIcon');
    const errorText = screen.queryByText(
      /There was an error while saving your note./i
    );

    expect(status).toBeInTheDocument();
    expect(errorIcon).toBeInTheDocument();
    expect(errorText).toBeInTheDocument();
  });
});
