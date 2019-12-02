import {formatDatetime, formatFullDatetime} from '../utils';
let DAY_COUNT = 0;
const MAX_OFFERS_COUNT_TO_SHOW = 2;

const createOfferTemplate = (offer) => {
  return (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `);
};

const createEventTemplate = (event) => {
  const startDatetime = formatFullDatetime(event.startDate);
  const endDatetime = formatFullDatetime(event.endDate);

  const startTime = startDatetime.substring(startDatetime.length - 5, startDatetime.length);
  const endTime = endDatetime.substring(endDatetime.length - 5, endDatetime.length);

  const durationHours = parseInt((event.endDate - event.startDate) / (1000 * 3600), 10);
  const durationMinutes = parseInt((event.endDate - event.startDate) / (1000 * 60), 10) % 60;

  const offers = event.offers.slice(0, MAX_OFFERS_COUNT_TO_SHOW).map((it) => createOfferTemplate(it)).join(`\n`);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.icon}" alt="${event.title} icon">
        </div>
        <h3 class="event__title">${event.title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${startDatetime}>${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime=${endDatetime}>${endTime}</time>
          </p>
          <p class="event__duration">${durationHours}H ${durationMinutes}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

const createTripDayTemplate = (day, items) => {
  const tripDay = `${day.toString().substring(3, 7)} ${day.getDate()}`;
  const datetime = formatDatetime(day);
  const isEmpty = items.length === 0;
  const events = isEmpty ? `` : items.map((it) => createEventTemplate(it)).join(`\n`);

  return isEmpty ? `` : (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${++DAY_COUNT}</span>
        <time class="day__date" datetime=${datetime}>${tripDay}</time>
      </div>

      <ul class="trip-events__list">
        ${events}
      </ul>
    </li>
  `);
};

export {createTripDayTemplate};
