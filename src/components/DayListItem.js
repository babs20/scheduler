import React from 'react';
import 'components/DayListItem.scss';
import classNames from 'classnames';

export default function DayListItem(props) {
  const listItemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });

  const formatSpots = () => {
    if (props.spots > 1) {
      return props.spots + ' spots';
    }
    return props.spots <= 0 ? 'no spots' : props.spots + ' spot';
  };
  return (
    <li className={listItemClass} onClick={() => props.setDay(props.name)}>
      <h2 className='text--regular'>{props.name}</h2>
      <h3 className='text--light'>{formatSpots()} remaining</h3>
    </li>
  );
}
