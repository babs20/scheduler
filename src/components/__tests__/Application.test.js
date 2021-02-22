import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import Application from 'components/Application';
import { fireEvent } from '@testing-library/react/dist';

afterEach(cleanup);

describe('Application', () => {
  it('changes the schedule when a new day is selected', () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'));

      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
  });

  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
});
