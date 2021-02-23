import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from 'reducers/application';

export default function useApplicationData() {
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

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

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
