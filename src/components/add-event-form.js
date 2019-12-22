import AbstractSmartComponent from './abstract-smart-component';
import {
  formatTimeWithSlashes, parseDateWithSlashes, getIcon, getEventType, generateEventPhotos, generateDescription, capitalizeFirstLetter, getOfferType, isSameOffers, AVAILABLE_OFFERS} from '../utils/common';
import {ACTIVITY_EVENTS, TRANSFER_EVENTS, DEFAULT_CITIES, PHOTOS_COUNT} from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const HIDE_CLASS = `visually-hidden`;
const DetailsMode = {
  OPEN: `open`,
  CLOSED: `closed`
};

const createDestinationListSection = (id) => {
  const optionsTemplate = DEFAULT_CITIES.map((destination) => {
    return `<option value="${destination}">${destination}</option>`;
  }).join(`\n`);

  return `
    <datalist id="destination-list-${id}">
      ${optionsTemplate}
    </datalist>
  `;
};

const createOfferSelector = (offer, isChecked, id) => {
  const {type, title, price} = offer;

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${type}-${id}"
        type="checkbox"
        name="event-offer-${type}"
        ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
};

const createOffersSection = (event) => {
  const {id, offers, name} = event;
  const eventName = name.split(`-`)[0].toUpperCase();

  const availableOffers = AVAILABLE_OFFERS[eventName];

  const offersTemplate = availableOffers.map((offer) => createOfferSelector(offer, offers.some((it) => isSameOffers(it, offer)), id)).join(`\n`);

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>
  `;
};

const createPhotoTemplate = (photo) => {
  return `
    <img class="event__photo" src="${photo}" alt="Event photo" />
  `;
};

const createDestinationSection = (event) => {
  const photosTemplate = event.photos.map((it) => createPhotoTemplate(it)).join(`\n`);

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">${event.destination}</h3>
      <p class="event__destination-description">${event.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosTemplate}
        </div>
      </div>
    </section>
  `;
};

const createEventTypeItem = (eventType, isChecked, id) => {
  return `
    <div class="event__type-item">
      <input
        id="event-type-${eventType.toLowerCase()}-${id}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.toLowerCase()}"
        ${isChecked ? `checked` : ``}>
      <label
        class="event__type-label  event__type-label--${eventType.toLowerCase()}"
        for="event-type-${eventType.toLowerCase()}-${id}">${eventType}
      </label>
    </div>
  `;
};

const createEventTypeListSection = (event) => {
  const {id} = event;
  const activityEventItems = ACTIVITY_EVENTS.map(
      (activityEvent) => createEventTypeItem(activityEvent, activityEvent === event.name, id)
  ).join(`\n`);

  const transferEventItems = TRANSFER_EVENTS.map(
      (transferEvent) => createEventTypeItem(transferEvent, transferEvent === event.name, id)
  ).join(`\n`);

  return `
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${transferEventItems}
      </fieldset>

      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>
        ${activityEventItems}
      </fieldset>
    </div>
  `;
};

const createFormHeaderTemplate = (event) => {
  const {id, type, name, price, destination, icon} = event;

  const preposition = (type === `activity`) ? `at` : `to`;
  const eventName = capitalizeFirstLetter(name);

  const startDate = formatTimeWithSlashes(event.startDate);
  const endDate = formatTimeWithSlashes(event.endDate);

  const eventTypeListSection = createEventTypeListSection(event);
  const destinationListSection = createDestinationListSection(id);

  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}" alt="${name} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      ${eventTypeListSection}
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${eventName} ${preposition}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}" required>
      ${destinationListSection}
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}"
        type="number" name="event-price"
        value="${price}"
        required
        min="0">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  `;
};

const createEditEventTemplate = (event) => {
  const headerInner = createFormHeaderTemplate(event);
  const offers = createOffersSection(event);
  const destination = createDestinationSection(event);

  return `
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        ${headerInner}
      </header>
      <section class="event__details visually-hidden">
        ${offers}
        ${destination}
      </section>
    </form>
  `;
};

class AddEventForm extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._eventForReset = Object.assign({}, event);
    this._detailsMode = DetailsMode.CLOSED;

    this._submitHandler = null;
    this._cancelHandler = null;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event);
  }

  setSubmitHandler(handler) {
    if (!this._submitHandler) {
      this._submitHandler = handler;
    }
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  setCancelClickHandler(handler) {
    if (!this._cancelHandler) {
      this._cancelHandler = handler;
    }
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._cancelHandler);
  }

  recoveryListeners() {
    this.getElement().addEventListener(`submit`, this._submitHandler);
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._cancelHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    if (this._detailsMode === DetailsMode.OPEN) {
      this._showDetails();
    }

    this._applyFlatpickr();
  }

  reset() {
    this._event = Object.assign({}, this._eventForReset);
    this.rerender();
  }

  getFormData() {
    const form = this.getElement();
    const eventDescription = form.querySelector(`.event__destination-description`).innerText;
    const formData = new FormData(form);
    const eventName = form.querySelector(`.event__type-output`).innerText.trim().split(` `)[0];
    const isActivityEvent = ACTIVITY_EVENTS.some((it) => it === eventName);
    const eventPhotos = [].map.call(form.querySelectorAll(`.event__photo`), (it) => it.src);
    const eventOffers = this._event.offers;

    const newPoint = {
      id: this._event.id,
      type: isActivityEvent ? `activity` : `transfer`,
      name: eventName,
      icon: `${eventName}.png`,
      startDate: parseDateWithSlashes(formData.get(`event-start-time`)),
      endDate: parseDateWithSlashes(formData.get(`event-end-time`)),
      destination: formData.get(`event-destination`),
      description: eventDescription,
      price: formData.get(`event-price`),
      photos: eventPhotos,
      offers: eventOffers,
      isFavorite: false
    };

    return newPoint;
  }

  _showDetails() {
    this.getElement().querySelector(`.event__details`).classList.remove(HIDE_CLASS);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._event = Object.assign({}, this._event,
          {type: getEventType(evt.target.value)},
          {name: evt.target.value},
          {icon: getIcon(evt.target.value)},
          {offers: []});
      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const inputValue = evt.target.value.trim();
      const isValidDestination = DEFAULT_CITIES.some((it) => it === inputValue);
      if (!isValidDestination) {
        evt.target.setCustomValidity(`Please, choose one from list`);
        this._detailsMode = DetailsMode.CLOSED;
        return;
      } else {
        this._event = Object.assign({}, this._event,
            {destination: evt.target.value.trim()},
            {description: generateDescription()},
            {photos: generateEventPhotos(PHOTOS_COUNT)}
        );
        evt.target.setCustomValidity(``);
        this._detailsMode = DetailsMode.OPEN;
        this.rerender();
      }
    });

    element.querySelector(`input[name=event-start-time]`).addEventListener(`change`, (evt) => {
      const dateValue = parseDateWithSlashes(evt.target.value);
      if (dateValue > this._event.endDate) {
        evt.target.setCustomValidity(`The start time should be earlier than the end time`);
        return;
      }
      this._event.startDate = dateValue;
      evt.target.setCustomValidity(``);
    });

    element.querySelector(`input[name=event-end-time]`).addEventListener(`change`, (evt) => {
      const dateValue = parseDateWithSlashes(evt.target.value);
      if (dateValue < this._event.startDate) {
        evt.target.setCustomValidity(`The end time should be later than the start time`);
        return;
      }
      this._event.endDate = dateValue;
      evt.target.setCustomValidity(``);
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      const price = evt.target.value;
      if (evt.target.validity.rangeUnderflow || evt.target.validity.valueMissing) {
        evt.target.setCustomValidity(`Please, enter valid price`);
        return;
      }
      this._event.price = +price;
      evt.target.setCustomValidity(``);
    });

    element.querySelector(`.event__section--offers`).addEventListener(`change`, () => {
      this._event.offers = [].map.call(element.querySelectorAll(`.event__offer-checkbox:checked + label`), (it) => {
        const offerLabel = it.innerText;
        return {
          type: getOfferType(offerLabel),
          title: offerLabel.split(`+`)[0],
          price: +offerLabel.split(`€`)[1]
        };
      });
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      Object.values(this._flatpickr).forEach((it) => it.destroy());
      this._flatpickr = null;
    }

    const [startDateInput, endDateInput] = Array.from(this.getElement().querySelectorAll(`.event__input--time`));

    this._flatpickr = Object.assign({}, {START: {}, END: {}});

    this._flatpickr.START = flatpickr(startDateInput, {
      enableTime: true,
      allowInput: true,
      defaultDate: this._event.startDate,
      formatDate: formatTimeWithSlashes
    });

    this._flatpickr.END = flatpickr(endDateInput, {
      enableTime: true,
      allowInput: true,
      defaultDate: this._event.endDate,
      formatDate: formatTimeWithSlashes
    });
  }
}

export default AddEventForm;
