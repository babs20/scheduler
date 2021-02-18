import { useEffect, useReducer } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  console.log('rendered');
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
        return {
          ...state,
          appointments: action.appointments,
          days: action.days,
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  function updateDaySpots(state, id, isAdd) {
    return state.days.map((dayObj) => {
      const daysMatch = dayObj.name === state.day;
      const isInterviewNull = state.appointments[id].interview === null;

      if ((daysMatch && isInterviewNull) || (daysMatch && isAdd)) {
        isAdd ? (dayObj.spots += 1) : (dayObj.spots -= 1);
        return dayObj;
      }
      return dayObj;
    });
  }

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

    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      dispatch({
        appointments,
        type: SET_INTERVIEW,
        days,
      });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = updateDaySpots(state, id, true);

    return axios
      .delete(`/api/appointments/${id}`, {
        ...appointment,
      })
      .then(() => {
        dispatch({
          appointments,
          type: SET_INTERVIEW,
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
