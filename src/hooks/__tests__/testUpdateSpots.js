const state = {
  day: 'Monday',
  days: [
    {
      id: 1,
      name: 'Monday',
      appointments: [1, 2, 3],
      interviewers: [1, 2],
      spots: 99,
    },
    {
      id: 2,
      name: 'Tuesday',
      appointments: [4, 5],
      interviewers: [1, 2],
      spots: 3,
    },
  ],

  interviewers: {
    1: {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
    2: {
      id: 2,
      name: 'Tori Malcolm',
      avatar: 'https://i.imgur.com/Nmx0Qxo.png',
    },
  },

  appointments: {
    1: { id: 1, time: '12pm', interview: null },
    2: { id: 2, time: '1pm', interview: null },
    3: {
      id: 3,
      time: '2pm',
      interview: { student: 'Archie Cohen', interviewer: 2 },
    },
    4: { id: 4, time: '3pm', interview: null },
    5: {
      id: 5,
      time: '4pm',
      interview: { student: 'Chad Takahashi', interviewer: 2 },
    },
  },
};

// Counts appointments for day that have null interview
const updateSpots = function (state) {
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

// This is the initial state
console.log('\n*** Initial Days State\n', state.days);

// Callthe updateSpots function
const days = updateSpots({ ...state });
console.log('\n*** Updated Days\n', days);

// Hopefully this is unchanged
console.log('\n*** Final Days State\n', state.days);
