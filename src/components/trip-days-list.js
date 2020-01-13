import AbstractComponent from './abstract-component';
import {formatDatetime, getWeekDay} from '../utils/common';
import {SortType} from '../const';
import {sanitizeTemplate} from '../utils/render';

const createDayInfoTemplate = (day, count) => {
  const tripDay = getWeekDay(day);
  const datetime = formatDatetime(day);
  return `
    <span class="day__counter">${count + 1}</span>
    <time class="day__date" datetime=${datetime}>${tripDay}</time>
  `;
};

const createListItemsTemplate = (events, count, sortType) => {
  const day = events[0].startDate;
  const isDayInfo = sortType === SortType.EVENT && events.length;
  const dayInfoTemplate = isDayInfo ? createDayInfoTemplate(day, count) : ``;
  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoTemplate}
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>
  `;
};

const createTripDaysListTemplate = (days, sortType) => {
  const listItemsTemplate = days.map((day, i) => createListItemsTemplate(day, i, sortType)).join(`\n`);

  return `
    <ul class="trip-days">
      ${listItemsTemplate}
    </ul>
  `;
};

class TripDaysList extends AbstractComponent {
  constructor(days, sortType) {
    super();
    this._days = days;
    this._sortType = sortType;
  }

  getTemplate() {
    const template = createTripDaysListTemplate(this._days, this._sortType);
    return sanitizeTemplate(template);
  }
}

export default TripDaysList;
