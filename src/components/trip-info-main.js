import AbstractComponent from './abstract-component';
import {isSameMonth, formatMonthDay, getDatesDiff} from '../utils/common';

const createTripInfoMainTemplate = (events) => {
  if (!events.length) {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title"></h1>
        <p class="trip-info__dates"></p>
      </div>
    `;
  }

  const cities = new Set(events.map((it) => it.destination));
  const startDate = events[0].startDate;
  const endDate = events[events.length - 1].endDate;

  const startTime = formatMonthDay(startDate);
  const endTime = isSameMonth(startDate, endDate) ? formatMonthDay(endDate).split(` `)[1] : formatMonthDay(endDate);

  const titles = Array.from(cities);
  const titlesTemplate = titles.length <= 2 ?
    titles.join(`&mdash`) :
    `${titles[0]} &mdash; ... &mdash; ${titles[titles.length - 1]}`;

  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${titlesTemplate}</h1>
      <p class="trip-info__dates">${startTime}&nbsp;&mdash;&nbsp;${endTime}</p>
    </div>
  `;
};

class TripInfoMain extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events.slice().sort((a, b) => getDatesDiff(a.startDate, b.startDate));
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._events);
  }
}

export default TripInfoMain;
