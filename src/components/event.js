import AbstractComponent from './abstract-component';
import {getDuration, getDatetime, capitalizeFirstLetter, getIcon} from '../utils/common';
import {MAX_OFFERS_COUNT_TO_SHOW} from '../const';

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
  const {type, startDate, endDate, price} = event;
  const eventTitle = capitalizeFirstLetter(type);
  const icon = getIcon(type);
  const start = getDatetime(startDate);
  const end = getDatetime(endDate);
  let {days, hours, minutes} = getDuration(startDate, endDate);
  if (!days && !hours && !minutes) {
    minutes = `0M`;
  }

  const offers = event.offers.slice(0, MAX_OFFERS_COUNT_TO_SHOW).map((it) => createOfferTemplate(it)).join(`\n`);

  return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}" alt="${name} icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${start.datetime}>${start.time}</time>
            &mdash;
            <time class="event__end-time" datetime=${end.datetime}>${end.time}</time>
          </p>
          <p class="event__duration">${days} ${hours} ${minutes}</p>
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

class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}

export default Event;
