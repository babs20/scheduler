export function getAppointmentsForDay(state, day) {
  const apptIDs = state.days.filter((obj) => obj.name === day);

  const apptsForTheDay =
    apptIDs.length > 0
      ? apptIDs[0].appointments.map((apptNum) => {
          return state.appointments[apptNum];
        })
      : [];

  return apptsForTheDay;
}
