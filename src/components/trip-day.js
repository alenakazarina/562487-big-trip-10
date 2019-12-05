import {formatDatetime, formatFullDatetime} from '../utils';

const MAX_OFFERS_COUNT_TO_SHOW = 2;

const createOfferTemplate = (offer) => {
  return `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `;
};

const createEventTemplate = (event) => {
  const {name, icon, price, startDate, endDate} = event;
  const startDatetime = formatFullDatetime(startDate);
  const endDatetime = formatFullDatetime(endDate);

  const startTime = startDatetime.substring(startDatetime.length - 5, startDatetime.length);
  const endTime = endDatetime.substring(endDatetime.length - 5, endDatetime.length);

  const durationHours = Math.floor((event.endDate - event.startDate) / (1000 * 3600));
  const durationMinutes = Math.floor((event.endDate - event.startDate) / (1000 * 60) % 60);

  const offers = event.offers.slice(0, MAX_OFFERS_COUNT_TO_SHOW).map((it) => createOfferTemplate(it)).join(`\n`);

  return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}" alt="${name} icon">
        </div>
        <h3 class="event__title">${name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${startDatetime}>${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime=${endDatetime}>${endTime}</time>
          </p>
          <p class="event__duration">${durationHours}H ${durationMinutes}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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
  `;
};

const createTripDayTemplate = (day, items, count) => {
  const tripDay = `${day.toString().substring(3, 7)} ${day.getDate()}`;
  const datetime = formatDatetime(day);
  const isEmpty = items.length === 0;
  const events = isEmpty ? `` : items.map((it) => createEventTemplate(it)).join(`\n`);

  return isEmpty ? `` : `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count + 1}</span>
        <time class="day__date" datetime=${datetime}>${tripDay}</time>
      </div>

      <ul class="trip-events__list">
        ${events}
      </ul>
    </li>
  `;
};

export {createTripDayTemplate};
