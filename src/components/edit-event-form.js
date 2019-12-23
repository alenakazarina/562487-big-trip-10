import AbstractSmartComponent from './abstract-smart-component';
import {
  formatTimeWithSlashes, parseDateWithSlashes, getDatesDiff, getIcon, generateEventPhotos, getEventType, generateDescription, capitalizeFirstLetter, getOfferType, isSameOffers, AVAILABLE_OFFERS} from '../utils/common';
import {HIDE_CLASS, ACTIVITY_EVENTS, TRANSFER_EVENTS, DEFAULT_CITIES, PHOTOS_COUNT, Mode} from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createFavoriteButtonTemplate = (id, isFavorite) => {
  const isChecked = isFavorite ? `checked` : ``;
  return `
    <input
      id="event-favorite-${id}"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isChecked}
      >
    <label class="event__favorite-btn" for="event-favorite-${id}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>
  `;
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

const createFormHeaderTemplate = (event, mode) => {
  const {id, type, name, price, destination, icon, isFavorite} = event;

  const preposition = (type === `activity`) ? `at` : `to`;
  const eventName = capitalizeFirstLetter(name);

  const startDate = formatTimeWithSlashes(event.startDate);
  const endDate = formatTimeWithSlashes(event.endDate);

  const eventTypeListSection = createEventTypeListSection(event);
  const destinationListSection = createDestinationListSection(id);

  const resetButtonName = mode === Mode.ADD ? `Cancel` : `Delete`;
  const isFavoriteButton = mode === Mode.ADD ? `` : createFavoriteButtonTemplate(id, isFavorite);

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
      <label class="visually-hidden" for="event-start-time-${id}">From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate}" required>
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
    <button class="event__reset-btn" type="reset">${resetButtonName}</button>
    ${isFavoriteButton}
  `;
};

const createDetailsTemplate = (event, isDetails) => {
  const offers = createOffersSection(event);
  const destination = createDestinationSection(event);
  const isHidden = isDetails ? `` : HIDE_CLASS;
  return `
    <section class="event__details ${isHidden}">
      ${offers}
      ${destination}
    </section>
  `;
};

const createEditEventTemplate = (event, mode, isDetails) => {
  const headerInner = createFormHeaderTemplate(event, mode);
  const detailsSection = createDetailsTemplate(event, isDetails);

  return mode === Mode.ADD ? `
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        ${headerInner}
      </header>
      ${detailsSection}
    </form>
  ` : `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          ${headerInner}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${detailsSection}
      </form>
    </li>
  `;
};

class EditEventForm extends AbstractSmartComponent {
  constructor(event, mode) {
    super();
    this._event = event;
    this._eventForReset = Object.assign({}, event);
    this._mode = mode;
    this._details = mode === Mode.EDIT ? true : false;

    this._submitHandler = null;
    this._deleteHandler = null;
    this._resetHandler = null;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, this._mode, this._details);
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    if (this._mode === Mode.ADD) {
      this.getElement().addEventListener(`submit`, this._submitHandler);
    } else {
      this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
    }
  }

  setDeleteClickHandler(handler) {
    this._deleteHandler = handler;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteHandler);
  }

  setCloseButtonClickHandler(handler) {
    this._resetHandler = handler;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._resetHandler);
  }

  recoveryListeners() {
    if (this._mode === Mode.EDIT) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._resetHandler);
    }
    if (this._mode === Mode.ADD) {
      this.getElement().addEventListener(`submit`, this._submitHandler);
    } else {
      this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
    }
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteHandler);
    this._setValidation();
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
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
      icon: `${eventName.toLowerCase()}.png`,
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

  _setValidation() {
    const startDateInput = this._element.querySelector(`input[name=event-start-time]`);

    if (getDatesDiff(this._event.startDate, this._event.endDate) > 0) {
      startDateInput.setCustomValidity(`The start time should be earlier than the end time`);
    } else {
      startDateInput.setCustomValidity(``);
    }
  }


  _subscribeOnEvents() {
    const element = this.getElement();

    if (this._mode === Mode.EDIT) {
      element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, () => {
        this._event = Object.assign({}, this._event, {isFavorite: !this._event.isFavorite});
      });
    }

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
        this._event.destination = ``;
        this._details = false;
      } else {
        this._event = Object.assign({}, this._event,
            {destination: evt.target.value.trim()},
            {description: generateDescription()}
        );
        if (this._mode === Mode.ADD) {
          this._event = Object.assign({}, this._event,
              {photos: generateEventPhotos(PHOTOS_COUNT)}
          );
        }
        this._details = true;
      }
      this.rerender();
    });

    element.querySelector(`input[name=event-start-time]`).addEventListener(`change`, (evt) => {
      this._event.startDate = parseDateWithSlashes(evt.target.value);
      this._setValidation();
    });

    element.querySelector(`input[name=event-end-time]`).addEventListener(`change`, (evt) => {
      this._event.endDate = parseDateWithSlashes(evt.target.value);
      this._setValidation();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._event.price = +evt.target.value;
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

export default EditEventForm;
