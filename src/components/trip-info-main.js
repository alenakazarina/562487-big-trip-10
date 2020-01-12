import AbstractComponent from './abstract-component';
import {isSameDay, isSameMonth, getDatesDiff, formatMonthDay} from '../utils/common';

const sortByStartDate = (events) => {
  return events.slice().sort((a, b) => getDatesDiff(a.startDate, b.startDate));
};

const createDatesTemplate = (events) => {
  const startDate = events[0].startDate;
  const endDate = events[events.length - 1].endDate;

  if (isSameDay(startDate, endDate)) {
    return formatMonthDay(startDate);
  }

  const startTime = formatMonthDay(startDate);
  const endTime = isSameMonth(startDate, endDate) ? formatMonthDay(endDate).split(` `)[1] : formatMonthDay(endDate);

  return `${startTime}&nbsp;&mdash;&nbsp;${endTime}`;
};

const createTitlesTemplate = (events) => {
  const titles = events.map((event) => event.destination.name);
  const isOneDestination = titles.every((title) => title === titles[0]);

  if (titles.length === 1 || isOneDestination) {
    return titles[0];
  }

  if (titles.length === 3 && (titles[0] === titles[1] || titles[1] === titles[2])) {
    return [titles[0], titles[2]].join(`&nbsp;&mdash;&nbsp;`);
  }

  if (titles.length === 2 || titles.length === 3) {
    return titles.join(`&nbsp;&mdash;&nbsp;`);
  }

  return `${titles[0]}&nbsp;&mdash; ... &mdash;&nbsp; ${titles[titles.length - 1]}`;
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
