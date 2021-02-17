export function getAppointmentsForDay(state, day) {
  const daysThatMatch = state.days.filter((obj) => obj.name === day);

  const apptsForTheDay =
    daysThatMatch.length > 0
      ? daysThatMatch[0].appointments.map((apptNum) => {
          return state.appointments[apptNum];
        })
      : [];

  return apptsForTheDay;
}
export function getInterviewersForDay(state, day) {
  const daysThatMatch = state.days.filter((obj) => obj.name === day);

  const interviewersForTheDay =
    daysThatMatch.length > 0
      ? daysThatMatch[0].interviewers.map(
          (interviewerId) => state.interviewers[interviewerId]
        )
      : [];
  return interviewersForTheDay;
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
