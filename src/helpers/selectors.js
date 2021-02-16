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

export function getInterview(state, interview) {
  if (!interview) return null;

  const interviewerId = interview.interviewer;
  const studentAndInterviewer = {
    student: interview.student,
    interviewer: state.interviewers[interviewerId],
  };

  return studentAndInterviewer;
}
