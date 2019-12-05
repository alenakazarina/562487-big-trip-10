import {formatDatetime, createElement} from '../utils';

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

class TripDay {
  constructor(day, events, count) {
    this._day = day;
    this._events = events;
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._events, this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this.element = null;
  }
}

export default TripDay;

