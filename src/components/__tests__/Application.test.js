import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByAltText,
  queryByText,
} from '@testing-library/react';
import Application from 'components/Application';
import { fireEvent } from '@testing-library/react/dist';
import axios from 'axios';

afterEach(cleanup);

describe('Application', () => {
  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const monday = getAllByTestId(container, 'day').find(
      (day) => queryByText(day, 'Monday') //doesnt return null so satisfies test
    );
    expect(getByText(monday, /no spots remaining/i)).toBeInTheDocument();
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find((appointment) => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Confirm Deletion?')).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, 'Add'));

    const monday = getAllByTestId(container, 'day').find(
      (day) => queryByText(day, 'Monday') //doesnt return null so satisfies test
    );
    expect(getByText(monday, /2 spots remaining/i)).toBeInTheDocument(); //SUPPOSED TO BE 2
  });

  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find((appointment) => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Brady Blair' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Brady Blair'));

    const monday = getAllByTestId(container, 'day').find(
      (day) => queryByText(day, 'Monday') //doesnt return null so satisfies test
    );
    expect(getByText(monday, /1 spot remaining/i)).toBeInTheDocument();
  });

  it('shows the save error when failing to save an appointment', async () => {
    const { container } = render(<Application />);
    axios.put.mockRejectedValueOnce();
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Error Saving'));
    fireEvent.click(getByAltText(appointment, 'Close'));
  });

  it('shows the delete error when failing to delete an appointment', async () => {
    const { container } = render(<Application />);
    axios.delete.mockRejectedValueOnce();
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find((appointment) => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Confirm Deletion?')).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Error Deleting'));
    fireEvent.click(getByAltText(appointment, 'Close'));
  });
});
