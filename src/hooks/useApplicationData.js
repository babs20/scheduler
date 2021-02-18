import { useEffect, useReducer } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value };
      case SET_INTERVIEW:
        if (state.appointments[action.id]) {
          state.appointments[action.id].interview = action.interview;
        }
        const appointments = action.appointments
          ? { ...action.appointments }
          : { ...state.appointments };

        console.log(action.days);
        return {
          ...state,
          appointments,
          ...action.days,
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  function updateDaySpots(state, id, isAdd) {
    return state.days.map((dayObj) => {
      if (dayObj.appointments.indexOf(id) >= 0) {
        isAdd ? (dayObj.spots += 1) : (dayObj.spots -= 1);
      }
      return dayObj;
    });
  }

  const updateSpotsByAppts = (state) => {
    return state.days.map((dayObj) => {
      let spotsFilled = 0;
      dayObj.appointments.forEach((apptId) => {
        if (state.appointments[apptId].interview !== null) spotsFilled++;
      });
      dayObj.spots = 5 - spotsFilled;
      return dayObj;
    });
  };

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
  });

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
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8001');

    webSocket.onmessage = (event) => {
      const { type, interview, id } = JSON.parse(event.data);

      if (type) {
        const days = updateSpotsByAppts(state);
        dispatch({
          type,
          interview,
          id,
          days,
        });
      }
      return () => webSocket.close();
    };
  }, [state]);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = updateDaySpots(state, id, false);

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days,
        id,
        interview,
      });
    });
  };

  const cancelInterview = (id) => {
    const days = updateDaySpots(state, id, true);

    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview: null,
        days,
      });
    });
  };

  const setDay = (day) => dispatch({ day, type: SET_DAY });

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
