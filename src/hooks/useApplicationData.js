import { useEffect, useReducer } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  /**
   * @desc update the amount of spots left for each day
   * @param state object with current state data
   * @return Array - updated state.days array to be passed to dispatch
   */
  const updateSpots = (state) => {
    return state.days.map((dayObj) => {
      let spotsFilled = 0;
      let bufferDayObj = { ...dayObj };
      let apptsPerDay = bufferDayObj.appointments.length;
      bufferDayObj.appointments.forEach((apptId) => {
        if (state.appointments[apptId].interview !== null) spotsFilled++;
      });
      bufferDayObj.spots = apptsPerDay - spotsFilled;
      return bufferDayObj;
    });
  };

  /**
   * @desc reducer used by useReducer to update state
   * @param state object with current state data
   * @param action which action case to pass the action data to update state
   * @return Object with updated state
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value };
      case SET_INTERVIEW:
        const buffer = { ...state };
        if (buffer.appointments[action.id]) {
          buffer.appointments[action.id].interview = action.interview;
        }

        const appointments = action.appointments
          ? { ...action.appointments }
          : { ...buffer.appointments };

        const days = updateSpots({ ...buffer });

        return {
          ...buffer,
          appointments,
          days,
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
  });

  /**
   * @desc update the current day depending on user selection of DayList
   * @param day string with day name from DayListItem value
   */
  const setDay = (day) => dispatch({ day, type: SET_DAY });

  /**
   * @desc request api data on page reload
   */
  useEffect(() => {
    const daysURL = '/api/days';
    const apptsURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';

    Promise.all([
      axios.get(daysURL),
      axios.get(apptsURL),
      axios.get(interviewersURL),
    ]).then((res) => {
      dispatch({
        value: {
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data,
        },
        type: SET_APPLICATION_DATA,
      });
    });

    const webSocket = new WebSocket('ws://localhost:8001');

    webSocket.onmessage = (event) => {
      const { type, interview, id } = JSON.parse(event.data);

      if (type) {
        dispatch({
          type,
          interview,
          id,
        });
      }
    };
    return () => webSocket.close();
  }, []);

  /**
   * @desc update the api database when user books or edits an interview
   * @param id number with the id for interview being updated
   * @param interview object with the interview data {"student": string, "interviewer": num}
   * @return Promise - to be used by Appointment componenet to render correct view when request completes
   */
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        id,
        interview,
      });
    });
  };

  /**
   * @desc update the api database when user cancels/deletes an interview
   * @param id number with the id for interview being updated
   * @return Promise - to be used by Appointment componenet to render correct view when request completes
   */
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview: null,
      });
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
