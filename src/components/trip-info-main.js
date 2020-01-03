import AbstractComponent from './abstract-component';
import {isSameMonth, getDatesDiff, formatMonthDay} from '../utils/common';

const sortByStartDate = (events) => {
  return events.slice().sort((a, b) => getDatesDiff(a.startDate, b.startDate));
};

const getUnique = (items) => {
  return new Set(items);
};

const createDatesTemplate = (events) => {
  const startDate = events[0].startDate;
  const endDate = events[events.length - 1].endDate;

  const startTime = formatMonthDay(startDate);
  const endTime = isSameMonth(startDate, endDate) ? formatMonthDay(endDate).split(` `)[1] : formatMonthDay(endDate);

  return `${startTime}&nbsp;&mdash;&nbsp;${endTime}`;
};

const createTitlesTemplate = (events) => {
  const titles = Array.from(getUnique(events.map((it) => it.destination.name)));

  return titles.length <= 3 ?
    titles.join(`&nbsp;&mdash;&nbsp;`) :
    `${titles[0]}&nbsp;&mdash; ... &mdash;&nbsp; ${titles[titles.length - 1]}`;
};

const createTripInfoMainTemplate = (events) => {
  if (!events.length) {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title"></h1>
        <p class="trip-info__dates"></p>
      </div>
    `;
  }

  const datesTemplate = createDatesTemplate(sortByStartDate(events));

  const titlesTemplate = createTitlesTemplate(sortByStartDate(events));

  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${titlesTemplate}</h1>
      <p class="trip-info__dates">${datesTemplate}</p>
    </div>
  `;
};

class TripInfoMain extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._events);
  }
}

export default TripInfoMain;
