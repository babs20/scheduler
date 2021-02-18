import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
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
      setState((prev) => ({
        ...prev,
        days: res[0].data,
        appointments: res[1].data,
        interviewers: res[2].data,
      }));
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

    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      updateSpots({ ...state }, id, false);
      setState({ ...state, appointments });
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
    return axios
      .delete(`/api/appointments/${id}`, {
        ...appointment,
      })
      .then(() => {
        updateSpots({ ...state }, id, true);
        setState({ ...state, appointments });
      });
  };

  const updateSpots = (state, id, isAdd) => {
    state.days.forEach((dayObj) => {
      if (
        dayObj.name === state.day &&
        state.appointments[id].interview === null
      ) {
        isAdd ? (dayObj.spots += 1) : (dayObj.spots -= 1);
      }
    });
  };

  const setDay = (day) => setState({ ...state, day });

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
