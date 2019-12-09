import AbstractComponent from './abstract-component';
import {formatDatetime} from '../utils/common';

const createTripDayTemplate = (day, items, count) => {
  const tripDay = `${day.toString().substring(3, 7)} ${day.getDate()}`;
  const datetime = formatDatetime(day);
  const isEmpty = items.length === 0;

  return isEmpty ? `` : `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count + 1}</span>
        <time class="day__date" datetime=${datetime}>${tripDay}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>
  `;
};

class TripDay extends AbstractComponent {
  constructor(day, events, count) {
    super();
    this._day = day;
    this._events = events;
    this._count = count;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._events, this._count);
  }
}

export default TripDay;

