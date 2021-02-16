import React, { useState, useEffect } from 'react';
import DayList from '../components/DayList';
import Appointment from '../components/Appointment';
import axios from 'axios';

import 'components/Application.scss';

const appointments = [
  {
    id: 1,
    time: '12pm',
  },
  {
    id: 2,
    time: '1pm',
    interview: {
      student: 'Lydia Miller-Jones',
      interviewer: {
        id: 1,
        name: 'Sylvia Palmer',
        avatar: 'https://i.imgur.com/LpaY82x.png',
      },
    },
  },
  {
    id: 3,
    time: '2pm',
    interview: {
      student: 'Brady Blair',
      interviewer: {
        id: 2,
        name: 'Tori Malcolm',
        avatar: 'https://i.imgur.com/Nmx0Qxo.png',
      },
    },
  },
  {
    id: 4,
    time: '3pm',
    interview: {
      student: 'Tony Smith',
      interviewer: {
        id: 3,
        name: 'Mildred Nazir',
        avatar: 'https://i.imgur.com/T2WwVfS.png',
      },
    },
  },
  {
    id: 5,
    time: '4pm',
  },
];

export default function Application(props) {
  const [days, setDays] = useState([]);
  const [day, updateDay] = useState('Monday');

  useEffect(() => {
    const url = 'http://localhost:8001/api/days';
    axios.get(url).then((res) => {
      setDays(res.data);
    });
  }, []);

  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>
          <DayList days={days} day={day} setDay={updateDay} />
        </nav>
        <img
          className='sidebar__lhl sidebar--centered'
          src='images/lhl.png'
          alt='Lighthouse Labs'
        />
      </section>
      <section className='schedule'>
        {appointments.map((appt) => (
          <Appointment key={appt.id} {...appt} />
        ))}
        <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
