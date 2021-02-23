export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

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

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return { ...state, ...action.value };
    case SET_INTERVIEW:
      const buffer = {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview,
          },
        },
      };

      return {
        ...buffer,
        days: updateSpots(buffer),
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
