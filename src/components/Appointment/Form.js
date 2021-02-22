import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const { onSave } = props;
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [studentName, setStudentName] = useState(props.name || '');
  const [error, setError] = useState('');

  const reset = () => {
    setInterviewer('null');
    setStudentName('');
  };

  const cancel = () => {
    reset();
    props.onCancel();
  };

  function validate() {
    if (studentName === '') {
      setError('Student name cannot be blank');
      return;
    }

    setError('');
    onSave(studentName, interviewer);
  }

  return (
    <main className='appointment__card appointment__card--create'>
      <section className='appointment__card-left'>
        <form autoComplete='off' onSubmit={(e) => e.preventDefault()}>
          <input
            className='appointment__create-input text--semi-bold'
            name='name'
            type='text'
            placeholder='Enter Student Name'
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            data-testid='student-name-input'
          />
          <section className='appointment__validation'>{error}</section>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className='appointment__card-right'>
        <section className='appointment__actions'>
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
