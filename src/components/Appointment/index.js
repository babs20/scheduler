import React from 'react';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import useVisualMode from 'hooks/useVisualMode';

import 'components/Appointment/styles.scss';

export default function Appointment(props) {
  const { bookInterview, cancelInterview, editInterview } = props;
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(props.id, interview).then(() => transition(SHOW));
  }

  function edit(name, interviewer) {
    transition(EDIT);
    const interview = {
      student: name,
      interviewer,
    };
    editInterview(props.id, interview).then(() => transition(SHOW));
  }

  function deleteAppt() {
    transition(CONFIRM);
    transition(DELETING);
    cancelInterview(props.id).then(() => transition(EMPTY));
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message='Saving' />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === CONFIRM && (
        <Confirm message='Confirm' onConfirm={deleteAppt} onCancel={back} />
      )}
    </article>
  );
}
