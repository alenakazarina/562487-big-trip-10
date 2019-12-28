import AbstractSmartComponent from './abstract-smart-component';
import {
  formatTimeWithSlashes, parseDateWithSlashes, getDatesDiff, getIcon, getEventType, capitalizeFirstLetter, hasSameTitle} from '../utils/common';
import {HIDE_CLASS, ACTIVITY_EVENTS, TRANSFER_EVENTS, Mode, Preposition} from '../const';
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

const createDestinationListSection = (id, destinations) => {
  const optionsTemplate = destinations.map((it) => `<option value="${it.name}">${it.name}</option>`).join(`\n`);

  return `
    <datalist id="destination-list-${id}">
      ${optionsTemplate}
    </datalist>
  `;
};

const createOfferSelector = (id, type, offer, isChecked) => {
  const {title, price} = offer;
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

//  отбирает по title с подменой
const getShowedOffers = (offers, availableOffers) => {
  return availableOffers.map((availableOffer) => {

    return hasSameTitle(offers, availableOffer) ? offers.find((it) => it.title === availableOffer.title) : availableOffer;
  });
};

const createOffersSection = (id, type, offers, availableOffers) => {
  const offersToShow = getShowedOffers(offers, availableOffers);

  const offersTemplate = offersToShow.map((offer, i) => createOfferSelector(`${id}-${i}`, type, offer, hasSameTitle(offers, offer))).join(`\n`);

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>
  `;
};

const createPhotoTemplate = (picture) => {
  const {src, description} = picture;
  return `
    <img class="event__photo" src="${src}" alt="${description}" />
  `;
};

const createDestinationSection = (destination) => {
  const {name, description, pictures} = destination;
  const photosTemplate = pictures.map((it) => createPhotoTemplate(it)).join(`\n`);

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">${name}</h3>
      <p class="event__destination-description">${description}</p>

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
        id="event-type-${eventType}-${id}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${isChecked ? `checked` : ``}>
      <label
        class="event__type-label  event__type-label--${eventType}"
        for="event-type-${eventType}-${id}">${capitalizeFirstLetter(eventType)}
      </label>
    </div>
  `;
};

const createEventTypeListSection = (event) => {
  const {id} = event;
  const activityEventItems = ACTIVITY_EVENTS.map(
      (activityEvent) => createEventTypeItem(activityEvent, activityEvent === event.type, id)
  ).join(`\n`);

  const transferEventItems = TRANSFER_EVENTS.map(
      (transferEvent) => createEventTypeItem(transferEvent, transferEvent === event.type, id)
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

const createFormHeaderTemplate = (event, destinations, mode) => {
  const {id, type, startDate, endDate, destination, price, isFavorite} = event;

  const eventName = capitalizeFirstLetter(type);
  const preposition = Preposition[getEventType(type)];
  const eventIcon = getIcon(type);
  const eventDestination = destination.name;

  const eventStartDate = formatTimeWithSlashes(startDate);
  const eventsEndDate = formatTimeWithSlashes(endDate);

  const eventTypeListSection = createEventTypeListSection(event);
  const destinationListSection = createDestinationListSection(id, destinations.getAll());

  const resetButtonName = mode === Mode.ADD ? `Cancel` : `Delete`;
  const isFavoriteButton = mode === Mode.ADD ? `` : createFavoriteButtonTemplate(id, isFavorite);

  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${eventIcon}" alt="${eventName} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      ${eventTypeListSection}
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${eventName} ${preposition}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${eventDestination}" list="destination-list-${id}" required>
      ${destinationListSection}
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${eventStartDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${eventsEndDate}" required>
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

const createDetailsTemplate = (event, destinations, availableOffers, isDetails) => {
  const {id, type, destination, offers} = event;
  const eventDestination = destinations.getDestinationByName(destination.name);
  const offersTemplate = availableOffers.length ? createOffersSection(id, type, offers, availableOffers) : ``;
  const destinationTemplate = createDestinationSection(eventDestination);
  const isHidden = isDetails ? `` : HIDE_CLASS;
  return `
    <section class="event__details ${isHidden}">
      ${offersTemplate}
      ${destinationTemplate}
    </section>
  `;
};

const createEditEventTemplate = (event, destinations, availableOffers, mode, isDetails) => {
  const headerInner = createFormHeaderTemplate(event, destinations, mode);
  const detailsSection = createDetailsTemplate(event, destinations, availableOffers, isDetails);

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
  constructor(event, destinations, offers, mode) {
    super();
    this._event = event;
    this._destinations = destinations;
    this._offers = offers;
    this._availableOffers = this._offers.getOffersByType(this._event.type);
    this._eventForReset = Object.assign({}, event);

    this._mode = mode;
    this._details = mode === Mode.EDIT;

    this._submitHandler = null;
    this._deleteHandler = null;
    this._resetHandler = null;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, this._destinations, this._availableOffers, this._mode, this._details);
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
    const form = this._mode === Mode.ADD ? this.getElement() : this.getElement().querySelector(`form`);
    const formData = new FormData(form);

    const newPoint = {
      id: this._event.id,
      type: this._event.type,
      startDate: parseDateWithSlashes(formData.get(`event-start-time`)),
      endDate: parseDateWithSlashes(formData.get(`event-end-time`)),
      destination: Object.assign({}, this._destinations.getDestinationByName(formData.get(`event-destination`))),
      price: +formData.get(`event-price`),
      offers: this._event.offers,
      isFavorite: this._event.isFavorite
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
      this._availableOffers = this._offers.getOffersByType(evt.target.value);
      this._event = Object.assign({}, this._event,
          {type: evt.target.value},
          {offers: []});

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const inputValue = evt.target.value.trim();
      const isValidDestination = this._destinations.getAll().findIndex((it) => it.name === inputValue);
      if (isValidDestination === -1) {
        this._event.destination.name = ``;
        this._details = false;
      } else {
        this._event.destination = Object.assign({}, this._event.destination, {name: evt.target.value.trim()});
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

    if (this._availableOffers.length) {
      element.querySelector(`.event__section--offers`).addEventListener(`change`, () => {
        const shownOffers = getShowedOffers(this._event.offers, this._availableOffers);
        this._event.offers = [].map.call(element.querySelectorAll(`.event__offer-checkbox:checked`), (it) => {
          const index = +it.id.split(`-`).pop();
          return Object.assign({}, shownOffers[index]);
        });
      });
    }
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
