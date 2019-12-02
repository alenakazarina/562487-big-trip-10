import {formatTimeWithSlashes} from '../utils';
import {EVENT_TYPES, AVAILABLE_OFFERS} from '../const';

const createOfferSelector = (event, offer) => {
  const isChecked = event.offers.some((it) => it.title === offer.title);

  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `);
};

const createOffersSection = (event) => {
  const offers = AVAILABLE_OFFERS.map((it) => createOfferSelector(event, it)).join(`\n`);

  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers}
      </div>
    </section>
  `);
};

const createPhotoTemplate = (photo) => {
  return (`
    <img class="event__photo" src="${photo}" alt="Event photo"></img>
  `);
};

const createDestinationSection = (event) => {
  const photosTemplate = event.photos.map((it) => createPhotoTemplate(it)).join(`\n`);
  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">${event.destination}</h3>
      <p class="event__destination-description">${event.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosTemplate}
        </div>
      </div>
    </section>
  `);
};

const createEventTypeItem = (it) => {
  const isChecked = false;
  return (`
    <div class="event__type-item">
      <input id="event-type-${it.name.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it.name.toLowerCase()}" ${isChecked}>
      <label class="event__type-label  event__type-label--${it.name.toLowerCase()}" for="event-type-${it.name.toLowerCase()}-1">${it.name}</label>
    </div>
  `);
};

const createEventTypeListSection = (event) => {
  const activityEventItems = EVENT_TYPES
    .filter((it) => it.type === `activity`)
    .map((it) => createEventTypeItem(it, event)).join(`\n`);

  const transferEventItems = EVENT_TYPES
    .filter((it) => it.type === `transfer`)
    .map((it) => createEventTypeItem(it, event)).join(`\n`);

  return (`
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${transferEventItems}
    </fieldset>

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
      ${activityEventItems}
    </fieldset>
  `);
};

const createFormHeaderTemplate = (event) => {
  const startDate = formatTimeWithSlashes(event.startDate);
  const endDate = formatTimeWithSlashes(event.endDate);
  const eventTypeListSection = createEventTypeListSection(event);
  const preposition = (event.type === `activity`) ? `at` : `to`;

  return (`
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${event.icon}" alt="${event.type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          ${eventTypeListSection}
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${event.title} ${preposition}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event.destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${event.price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
  `);
};

const createEditEventTemplate = (event) => {
  const headerInner = createFormHeaderTemplate(event);
  const offers = createOffersSection(event);
  const destination = createDestinationSection(event);

  return `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          ${headerInner}
        </header>
        <section class="event__details">
          ${offers}
          ${destination}
        </section>
      </form>
    </li>
  `;
};

export {createEditEventTemplate};
