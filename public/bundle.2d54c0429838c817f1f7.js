/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/abstract-component.js":
/*!**********************************************!*\
  !*** ./src/components/abstract-component.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render */ "./src/utils/render.js");


class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["createElement"])(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (AbstractComponent);


/***/ }),

/***/ "./src/components/abstract-smart-component.js":
/*!****************************************************!*\
  !*** ./src/components/abstract-smart-component.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


class AbstractSmartComponent extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  recoveryListeners() {
    throw Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parentElement.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}

/* harmony default export */ __webpack_exports__["default"] = (AbstractSmartComponent);


/***/ }),

/***/ "./src/components/edit-event-form.js":
/*!*******************************************!*\
  !*** ./src/components/edit-event-form.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_smart_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-smart-component */ "./src/components/abstract-smart-component.js");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ "./src/utils/common.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../const */ "./src/const.js");




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
  const optionsTemplate = _const__WEBPACK_IMPORTED_MODULE_2__["DEFAULT_CITIES"].map((destination) => {
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

  const availableOffers = _utils_common__WEBPACK_IMPORTED_MODULE_1__["AVAILABLE_OFFERS"][eventName];

  const offersTemplate = availableOffers.map((offer) => createOfferSelector(offer, offers.some((it) => Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["isSameOffers"])(it, offer)), id)).join(`\n`);

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
  const activityEventItems = _const__WEBPACK_IMPORTED_MODULE_2__["ACTIVITY_EVENTS"].map(
      (activityEvent) => createEventTypeItem(activityEvent, activityEvent === event.name, id)
  ).join(`\n`);

  const transferEventItems = _const__WEBPACK_IMPORTED_MODULE_2__["TRANSFER_EVENTS"].map(
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
  const {id, type, name, price, destination, icon, isFavorite} = event;

  const preposition = (type === `activity`) ? `at` : `to`;
  const eventName = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["capitalizeFirstLetter"])(name);

  const startDate = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["formatTimeWithSlashes"])(event.startDate);
  const endDate = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["formatTimeWithSlashes"])(event.endDate);

  const eventTypeListSection = createEventTypeListSection(event);
  const destinationListSection = createDestinationListSection(id);
  const favoriteButtonTemplate = createFavoriteButtonTemplate(id, isFavorite);

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
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
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
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>

    ${favoriteButtonTemplate}
  `;
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
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offers}
          ${destination}
        </section>
      </form>
    </li>
  `;
};

class EditEventForm extends _abstract_smart_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(event) {
    super();
    this._event = event;
    this._eventForReset = Object.assign({}, event);

    this._submitHandler = null;
    this._resetHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event);
  }

  setSubmitHandler(handler) {
    if (!this._submitHandler) {
      this._submitHandler = handler;
    }
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
  }

  setCloseButtonClickHandler(handler) {
    if (!this._resetHandler) {
      this._resetHandler = handler;
    }
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._resetHandler);
    this._subscribeOnEvents();
  }

  reset() {
    this._event = Object.assign({}, this._eventForReset);
    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, () => {
      this._event = Object.assign({}, this._event, {isFavorite: !this._event.isFavorite});
    });

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._event = Object.assign({}, this._event,
          {type: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getEventType"])(evt.target.value)},
          {name: evt.target.value},
          {icon: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getIcon"])(evt.target.value)},
          {offers: []});
      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const inputValue = evt.target.value.trim();
      const isValidDestination = _const__WEBPACK_IMPORTED_MODULE_2__["DEFAULT_CITIES"].some((it) => it === inputValue);
      if (!isValidDestination) {
        evt.target.value = this._event.destination;
      } else {
        this._event = Object.assign({}, this._event,
            {destination: evt.target.value.trim()},
            {description: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["generateDescription"])()}
        );
      }
      this.rerender();
    });

    element.querySelector(`.event__section--offers`).addEventListener(`change`, () => {
      this._event.offers = [].map.call(element.querySelectorAll(`.event__offer-checkbox:checked + label`), (it) => {
        const offerLabel = it.innerText;
        return {
          type: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getOfferType"])(offerLabel),
          title: offerLabel.split(`+`)[0],
          price: +offerLabel.split(`€`)[1]
        };
      });
    });
  }
}

/* harmony default export */ __webpack_exports__["default"] = (EditEventForm);


/***/ }),

/***/ "./src/components/event.js":
/*!*********************************!*\
  !*** ./src/components/event.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ "./src/utils/common.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../const */ "./src/const.js");




const getEventDuration = (startDate, endDate) => {
  let durationDays = Math.floor((endDate - startDate) / (1000 * 3600 * 24));
  let durationHours = Math.floor((endDate - startDate) / (1000 * 3600));
  let durationMinutes = Math.floor((endDate - startDate) / (1000 * 60) % 60);

  durationDays = durationDays ? `${durationDays}D` : ``;
  durationHours = (durationDays || durationHours) ? `${Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["castTimeFormat"])(durationHours)}H` : ``;
  durationMinutes = (durationHours || durationMinutes) ? `${Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["castTimeFormat"])(durationMinutes)}M` : ``;
  return {
    days: durationDays,
    hours: durationHours,
    minutes: durationMinutes
  };
};

const getDatetime = (date) => {
  const dateTime = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["formatFullDatetime"])(date);
  return {
    datetime: dateTime,
    time: dateTime.substring(dateTime.length - 5, dateTime.length)
  };
};

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
  const eventTitle = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["capitalizeFirstLetter"])(name);

  const start = getDatetime(startDate);
  const end = getDatetime(endDate);

  const {days, hours, minutes} = getEventDuration(startDate, endDate);

  const offers = event.offers.slice(0, _const__WEBPACK_IMPORTED_MODULE_2__["MAX_OFFERS_COUNT_TO_SHOW"]).map((it) => createOfferTemplate(it)).join(`\n`);

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

class Event extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
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

/* harmony default export */ __webpack_exports__["default"] = (Event);


/***/ }),

/***/ "./src/components/filters.js":
/*!***********************************!*\
  !*** ./src/components/filters.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


const createFilter = (filter) => {
  const isChecked = filter.name === `EveryThing` ? `checked` : ``;

  return `
    <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>
  `;
};

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((it) => createFilter(it)).join(`\n`);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

class Filters extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Filters);


/***/ }),

/***/ "./src/components/menu.js":
/*!********************************!*\
  !*** ./src/components/menu.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


const MENU_TABS = [
  `Table`,
  `Stats`
];

const createTab = (title, isActive) => {
  const activeClass = isActive ? `trip-tabs__btn--active` : ``;

  return `
    <a class="trip-tabs__btn ${activeClass}" href="#">${title}</a>
  `;
};

const createMenuTemplate = (tabs) => {
  const tabsTemplate = tabs.map((it, i) => createTab(it, i === 0)).join(`\n`);

  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `;
};

class Menu extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
    this._tabs = MENU_TABS;
  }

  getTemplate() {
    return createMenuTemplate(this._tabs);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Menu);


/***/ }),

/***/ "./src/components/no-points.js":
/*!*************************************!*\
  !*** ./src/components/no-points.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


class NoPoints extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  getTemplate() {
    return `
      <p class="trip-events__msg">Click New Event to create your first point</p>
    `;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (NoPoints);


/***/ }),

/***/ "./src/components/sort.js":
/*!********************************!*\
  !*** ./src/components/sort.js ***!
  \********************************/
/*! exports provided: sortTypes, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortTypes", function() { return sortTypes; });
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


const sortTypes = {
  event: {
    id: `event`,
    sortFn: (events) => events.slice()
  },
  time: {
    id: `time`,
    sortFn: (events) => events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate))
  },
  price: {
    id: `price`,
    sortFn: (events) => events.slice().sort((a, b) => b.price - a.price)
  }
};

const createDirectionIcon = () => {
  return `
    <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>
  `;
};

const createSortFitlerTemplate = (sortType, isChecked) => {
  const directionIcon = (sortType === sortTypes.time.id || sortType === sortTypes.price.id) ? createDirectionIcon() : ``;

  return `
    <div class="trip-sort__item  trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        data-sort-type="${sortType}"
        ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType} ${directionIcon}</label>
    </div>
  `;
};

const createSortTemplate = () => {
  const sortFitlersTemplate = Object.keys(sortTypes).map((sortType, i) => createSortFitlerTemplate(sortType, i === 0)).join(`\n`);

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortFitlersTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `;
};

class Sort extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
    this._active = sortTypes.event.id;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const {sortType} = evt.target.dataset;

      if (sortType && sortType !== this._active) {
        this._active = sortType;
        handler(sortType);
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Sort);


/***/ }),

/***/ "./src/components/trip-day.js":
/*!************************************!*\
  !*** ./src/components/trip-day.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ "./src/utils/common.js");



const createTripDayTemplate = (day, items, count) => {
  if (!day && !items && !count) {
    return `
      <li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>
    `;
  }

  const tripDay = `${day.toString().substring(3, 7)} ${day.getDate()}`;
  const datetime = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["formatDatetime"])(day);
  const isEmpty = items.length === 0;

  return isEmpty ? `` : `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count + 1}</span>
        <time class="day__date" datetime=${datetime}>${tripDay}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>
  `;
};

class TripDay extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(day, events, count) {
    super();
    this._day = day;
    this._events = events;
    this._count = count;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._events, this._count);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TripDay);



/***/ }),

/***/ "./src/components/trip-days-list.js":
/*!******************************************!*\
  !*** ./src/components/trip-days-list.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


class TripDaysList extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  getTemplate() {
    return `
      <ul class="trip-days"></ul>
    `;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TripDaysList);


/***/ }),

/***/ "./src/components/trip-info-cost.js":
/*!******************************************!*\
  !*** ./src/components/trip-info-cost.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

const calculateCosts = (events) => {
  if (events.length === 0) {
    return 0;
  }
  const eventsPricesAmount = calculateSum(events.map((it) => it.price));
  const offers = events.map((event) => event.offers.map((offer) => offer.price));
  const offersAmount = calculateSum(offers.map((arr) => calculateSum(arr)));
  return eventsPricesAmount + offersAmount;
};

const createTripInfoCostTemplate = (events) => {
  const value = calculateCosts(events);
  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${value}</span>
    </p>
  `;
};

class TripInfoCost extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._events);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TripInfoCost);


/***/ }),

/***/ "./src/components/trip-info-main.js":
/*!******************************************!*\
  !*** ./src/components/trip-info-main.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _abstract_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract-component */ "./src/components/abstract-component.js");


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

  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const startTime = `${startDate.toString().substring(3, 7)} ${startDate.getDate()}`;
  const endTime = isSameMonth ? `${endDate.getDate()}` : `${endDate.toString().substring(3, 7)} ${endDate.getDate()}`;

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

class TripInfoMain extends _abstract_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._events);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TripInfoMain);


/***/ }),

/***/ "./src/const.js":
/*!**********************!*\
  !*** ./src/const.js ***!
  \**********************/
/*! exports provided: PHOTO_PATH, DEFAULT_DESCRIPTION, DEFAULT_CITIES, ACTIVITY_EVENTS, TRANSFER_EVENTS, ICON_PATHS, OFFER_TYPES, MAX_OFFERS_COUNT, MAX_OFFERS_COUNT_TO_SHOW */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PHOTO_PATH", function() { return PHOTO_PATH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_DESCRIPTION", function() { return DEFAULT_DESCRIPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CITIES", function() { return DEFAULT_CITIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACTIVITY_EVENTS", function() { return ACTIVITY_EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRANSFER_EVENTS", function() { return TRANSFER_EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ICON_PATHS", function() { return ICON_PATHS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OFFER_TYPES", function() { return OFFER_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_OFFERS_COUNT", function() { return MAX_OFFERS_COUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_OFFERS_COUNT_TO_SHOW", function() { return MAX_OFFERS_COUNT_TO_SHOW; });
const PHOTO_PATH = `https://picsum.photos/300/150?r=`;
const MAX_OFFERS_COUNT_TO_SHOW = 3;
const MAX_OFFERS_COUNT = 5;

const DEFAULT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DEFAULT_CITIES = [
  `Saint Petersburg`,
  `Amsterdam`,
  `Geneva`,
  `Chamonix`
];

const TRANSFER_EVENTS = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];

const ACTIVITY_EVENTS = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

const ICON_PATHS = [
  `bus.png`,
  `check-in.png`,
  `drive.png`,
  `flight.png`,
  `restaurant.png`,
  `ship.png`,
  `sightseeing.png`,
  `taxi.png`,
  `train.png`,
  `transport.png`
];

const OFFER_TYPES = [
  `meal`,
  `luggage`,
  `comfort`,
  `seats`
];





/***/ }),

/***/ "./src/controllers/point.js":
/*!**********************************!*\
  !*** ./src/controllers/point.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render */ "./src/utils/render.js");
/* harmony import */ var _components_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/event */ "./src/components/event.js");
/* harmony import */ var _components_edit_event_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/edit-event-form */ "./src/components/edit-event-form.js");




const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._event = null;
    this._mode = Mode.DEFAULT;

    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._onEscKeyPress = this._onEscKeyPress.bind(this);
  }

  render(event) {
    this._event = event;

    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new _components_event__WEBPACK_IMPORTED_MODULE_1__["default"](event);
    this._editEventComponent = new _components_edit_event_form__WEBPACK_IMPORTED_MODULE_2__["default"](event);

    this._eventComponent.setClickHandler(() => this._showEditForm());

    this._editEventComponent.setCloseButtonClickHandler(() => {
      this._editEventComponent.reset();
      this._showEvent();
    });

    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._event, this._editEventComponent._event);
      this.setDefaultView();
    });

    if (oldEventComponent && oldEditEventComponent) {
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["replace"])(this._eventComponent, oldEventComponent);
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["replace"])(this._editEventComponent, oldEditEventComponent);
    } else {
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["render"])(this._container, this._eventComponent.getElement());
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._showEvent();
    }
  }

  _onEscKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._showEvent();
    }
  }

  _showEvent() {
    this._editEventComponent.reset();
    this._replaceFormToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.DEFAULT;
  }

  _showEditForm() {
    this._onViewChange();
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.EDIT;
  }

  _replaceFormToEvent() {
    Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["replace"])(this._eventComponent, this._editEventComponent);
  }

  _replaceEventToForm() {
    Object(_utils_render__WEBPACK_IMPORTED_MODULE_0__["replace"])(this._editEventComponent, this._eventComponent);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (PointController);


/***/ }),

/***/ "./src/controllers/trip.js":
/*!*********************************!*\
  !*** ./src/controllers/trip.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_sort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/sort */ "./src/components/sort.js");
/* harmony import */ var _components_trip_days_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/trip-days-list */ "./src/components/trip-days-list.js");
/* harmony import */ var _components_trip_day__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/trip-day */ "./src/components/trip-day.js");
/* harmony import */ var _components_no_points__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/no-points */ "./src/components/no-points.js");
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./point */ "./src/controllers/point.js");
/* harmony import */ var _utils_render__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/render */ "./src/utils/render.js");







const renderEvents = (events, container, onDataChange, onViewChange) => {
  return events.map((event) => {
    const pointController = new _point__WEBPACK_IMPORTED_MODULE_4__["default"](container, onDataChange, onViewChange);
    pointController.render(event);

    return pointController;
  });
};

const renderTripDays = (container, eventsDates, events, onDataChange, onViewChange) => {
  return eventsDates.map((day, i) => {
    const dayEvents = events.filter((event) => event.startDate === day);
    const tripDayComponent = new _components_trip_day__WEBPACK_IMPORTED_MODULE_2__["default"](day, dayEvents, i);

    Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(container, tripDayComponent.getElement());
    return renderEvents(dayEvents, tripDayComponent.getElement().children[1], onDataChange, onViewChange);
  });
};

class TripController {
  constructor(container) {
    this._events = [];
    this._eventsDates = [];
    this._pointControllers = [];
    this._sortType = `event`;

    this._container = container;
    this._sortComponent = new _components_sort__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this._tripDaysListComponent = new _components_trip_days_list__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this._noPointsComponent = new _components_no_points__WEBPACK_IMPORTED_MODULE_3__["default"]();
    this._tripDayComponent = new _components_trip_day__WEBPACK_IMPORTED_MODULE_2__["default"]();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events.map((event) => Object.assign({}, event, {isFavorite: false}));

    this._eventsDates = this._events.map((event) => event.startDate)
      .filter((date, i, arr) => arr.slice(i + 1, arr.length).every((it) => it !== date));

    if (!this._events.length) {
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(this._container, this._noPointsComponent.getElement());

    } else {
      const tripDaysListElement = this._tripDaysListComponent.getElement();

      Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(this._container, this._sortComponent.getElement());
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(this._container, tripDaysListElement);
      //  render
      this._pointControllers = renderTripDays(tripDaysListElement, this._eventsDates, this._events, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  _onSortTypeChange(sortType) {
    //  sort events by sortType
    this._sortType = sortType;
    const sortedEvents = Object.values(_components_sort__WEBPACK_IMPORTED_MODULE_0__["sortTypes"]).find((it) => it.id === this._sortType).sortFn(this._events);
    //  clean container
    const tripDaysListElement = this._tripDaysListComponent.getElement();
    tripDaysListElement.innerHTML = ``;

    //  remove Esc Listeners if exists
    const isEditMode = this._pointControllers.some((it) => it._mode === `edit`);
    if (isEditMode) {
      document.removeEventListener(`keydown`, this._pointControllers.find((it) => it._mode === `edit`)._onEscKeyPress);
    }

    //  render
    if (this._sortType !== `event`) {
      this._sortComponent.getElement().children[0].innerHTML = ``;
      for (let child of this._tripDayComponent.getElement().children) {
        child.innerHTML = ``;
      }
      Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(tripDaysListElement, this._tripDayComponent.getElement());
      this._pointControllers = renderEvents(sortedEvents, this._tripDayComponent.getElement().children[1], this._onDataChange, this._onViewChange);
    } else {
      this._sortComponent.getElement().children[0].innerHTML = `Day`;
      this._pointControllers = renderTripDays(tripDaysListElement, this._eventsDates, sortedEvents, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  //  update this._events with newEvent
  _onDataChange(pointController, oldEvent, newEvent) {
    const i = this._events.findIndex((it) => it === oldEvent);
    if (i !== -1) {
      this._events[i] = newEvent;
    }

    pointController.render(newEvent);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}

/* harmony default export */ __webpack_exports__["default"] = (TripController);


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_trip_info_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/trip-info-main */ "./src/components/trip-info-main.js");
/* harmony import */ var _components_trip_info_cost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/trip-info-cost */ "./src/components/trip-info-cost.js");
/* harmony import */ var _components_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/menu */ "./src/components/menu.js");
/* harmony import */ var _components_filters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/filters */ "./src/components/filters.js");
/* harmony import */ var _controllers_trip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controllers/trip */ "./src/controllers/trip.js");
/* harmony import */ var _utils_render__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/render */ "./src/utils/render.js");
/* harmony import */ var _mocks_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mocks/events */ "./src/mocks/events.js");
/* harmony import */ var _mocks_filters__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mocks/filters */ "./src/mocks/filters.js");









const EVENTS_COUNT = 22;
const DAYS_COUNT = 4;

const sortByStartDate = (arr) => arr.map((it) => it).sort((a, b) => a.startDate > b.startDate ? 1 : -1);

const events = Object(_mocks_events__WEBPACK_IMPORTED_MODULE_6__["generateEvents"])(EVENTS_COUNT, DAYS_COUNT);
const filters = Object(_mocks_filters__WEBPACK_IMPORTED_MODULE_7__["generateFilters"])(events);

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = tripInfoElement.nextElementSibling;


const sortedEvents = events.length ? sortByStartDate(events) : events;

Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(tripInfoElement, new _components_trip_info_main__WEBPACK_IMPORTED_MODULE_0__["default"](sortedEvents).getElement());
Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(tripInfoElement, new _components_trip_info_cost__WEBPACK_IMPORTED_MODULE_1__["default"](sortedEvents).getElement());

Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(tripControlsElement, new _components_menu__WEBPACK_IMPORTED_MODULE_2__["default"]().getElement());
Object(_utils_render__WEBPACK_IMPORTED_MODULE_5__["render"])(tripControlsElement, new _components_filters__WEBPACK_IMPORTED_MODULE_3__["default"](filters).getElement());


const tripController = new _controllers_trip__WEBPACK_IMPORTED_MODULE_4__["default"](document.querySelector(`.trip-events`));
tripController.render(sortedEvents);


/***/ }),

/***/ "./src/mocks/events.js":
/*!*****************************!*\
  !*** ./src/mocks/events.js ***!
  \*****************************/
/*! exports provided: generateEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateEvents", function() { return generateEvents; });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../const */ "./src/const.js");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/common */ "./src/utils/common.js");




const PHOTOS_COUNT = 5;

const generateEventPhotos = (count) => new Array(count).fill(``)
  .map(() => Math.round(Math.random() * 1000))
  .map((number) => _const__WEBPACK_IMPORTED_MODULE_0__["PHOTO_PATH"].concat(number));

const generateDatesArray = (daysCount) => {
  return new Array(daysCount)
    .fill(``)
    .map(() => new Date())
    .map((date, i) => {
      if (i % 2) {
        date.setDate(date.getDate() + i);
        date.setHours(date.getHours() + i);
      } else {
        date.setDate(date.getDate() - i);
        date.setHours(date.getHours() - i);
      }
      return date;
    });
};

const genetateEndDate = (date) => {
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomIntegerNumber"])(0, 3));
  endDate.setHours(endDate.getHours() + Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomIntegerNumber"])(0, 2));
  endDate.setMinutes(endDate.getMinutes() + Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomIntegerNumber"])(1, 40));
  return endDate;
};

const generateEventDates = (dates) => {
  const startDate = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomArrayItem"])(dates);

  return {
    eventStartDate: startDate,
    eventEndDate: genetateEndDate(startDate)
  };
};

const defaultEvents = [].concat(_const__WEBPACK_IMPORTED_MODULE_0__["ACTIVITY_EVENTS"]
  .map((event) => ({
    eventType: `activity`,
    eventName: event,
    eventIcon: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getIcon"])(event)
  })))
  .concat(_const__WEBPACK_IMPORTED_MODULE_0__["TRANSFER_EVENTS"].map((event) => ({
    eventType: `transfer`,
    eventName: event,
    eventIcon: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getIcon"])(event)
  })));

const generateEvent = (eventID, dates) => {
  const {eventType, eventName, eventIcon} = Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomArrayItem"])(defaultEvents);
  const {eventStartDate, eventEndDate} = generateEventDates(dates);

  return {
    id: eventID,
    type: eventType,
    name: eventName,
    icon: eventIcon,
    startDate: eventStartDate,
    endDate: eventEndDate,
    destination: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomArrayItem"])(_const__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_CITIES"]),
    price: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["getRandomIntegerNumber"])(1, 10000),
    description: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["generateDescription"])(),
    photos: generateEventPhotos(PHOTOS_COUNT),
    offers: Object(_utils_common__WEBPACK_IMPORTED_MODULE_1__["generateOffers"])(eventName, _const__WEBPACK_IMPORTED_MODULE_0__["MAX_OFFERS_COUNT"])
  };
};

const generateEvents = (eventsCount, daysCount) => {
  const dates = generateDatesArray(daysCount);

  return new Array(eventsCount)
    .fill(``)
    .map((it, id) => generateEvent(id, dates));
};




/***/ }),

/***/ "./src/mocks/filters.js":
/*!******************************!*\
  !*** ./src/mocks/filters.js ***!
  \******************************/
/*! exports provided: generateFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateFilters", function() { return generateFilters; });
const everythingFilter = {
  name: `Everything`,
  filterFn(days) {
    return days;
  }
};

const futureFilter = {
  name: `Future`,
  filterFn(days) {
    return days.filter((day) => day > Date.now());
  }
};

const pastFilter = {
  name: `Past`,
  filterFn(days) {
    return days.filter((day) => day < Date.now());
  }
};

const FILTERS = [
  everythingFilter,
  futureFilter,
  pastFilter
];

const generateFilters = (dates) => FILTERS.map((filter) => ({
  name: filter.name,
  days: filter.filterFn(dates)
}));




/***/ }),

/***/ "./src/utils/common.js":
/*!*****************************!*\
  !*** ./src/utils/common.js ***!
  \*****************************/
/*! exports provided: castTimeFormat, formatTimeWithSlashes, formatDatetime, formatFullDatetime, getRandomArrayItem, getRandomIntegerNumber, getRandomArray, generateDescription, getIcon, capitalizeFirstLetter, generateOffers, getEventType, getOfferType, getOfferObjects, isSameOffers, AVAILABLE_OFFERS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castTimeFormat", function() { return castTimeFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatTimeWithSlashes", function() { return formatTimeWithSlashes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatDatetime", function() { return formatDatetime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatFullDatetime", function() { return formatFullDatetime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomArrayItem", function() { return getRandomArrayItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomIntegerNumber", function() { return getRandomIntegerNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomArray", function() { return getRandomArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateDescription", function() { return generateDescription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIcon", function() { return getIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalizeFirstLetter", function() { return capitalizeFirstLetter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateOffers", function() { return generateOffers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEventType", function() { return getEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOfferType", function() { return getOfferType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOfferObjects", function() { return getOfferObjects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSameOffers", function() { return isSameOffers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVAILABLE_OFFERS", function() { return AVAILABLE_OFFERS; });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../const */ "./src/const.js");


const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTimeWithSlashes = (date) => {
  // 18/03/19 12:25
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = date.getFullYear() % 2000;
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatDatetime = (date) => {
  // 2019-10-19
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth() + 1);
  const day = castTimeFormat(date.getDate());
  return `${year}-${month}-${day}`;
};

const formatFullDatetime = (date) => {
  // 2019-10-19T22:30
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return formatDatetime(date).concat(`T${hours}:${minutes}`);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArray = (items, maxLength) => {
  const length = getRandomIntegerNumber(0, maxLength);
  return new Array(length).fill(``).map(() => getRandomArrayItem(items));
};

const getIcon = (eventType) => _const__WEBPACK_IMPORTED_MODULE_0__["ICON_PATHS"].filter((it) => it.startsWith(eventType.toLowerCase())).join();

const getEventType = (event) => _const__WEBPACK_IMPORTED_MODULE_0__["ACTIVITY_EVENTS"].findIndex((it) => it.toLowerCase() === event) !== -1 ? `activity` : `transfer`;

const generateDescription = () => {
  const sentences = _const__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_DESCRIPTION"].split(`.`).filter((it, i, arr) => (i !== arr.length - 1));
  let count = getRandomIntegerNumber(1, 3);
  let description = ``;
  while (count) {
    description = description.concat(getRandomArrayItem(sentences), `.`);
    count--;
  }
  return description;
};

const capitalizeFirstLetter = (str) => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

const generateOffers = (name, count) => {
  const eventName = name.split(`-`)[0].toUpperCase();
  const randomOffers = new Set(getRandomArray(AVAILABLE_OFFERS[eventName], count));

  return Array.from(randomOffers);
};

const getOfferType = (offer) => {
  return _const__WEBPACK_IMPORTED_MODULE_0__["OFFER_TYPES"].filter((offerType) => offer.toLowerCase().includes(offerType)).join();
};

const getOfferObjects = (offers) => offers.map((offer) => ({
  type: getOfferType(offer),
  title: offer.split(`+`)[0],
  price: +offer.split(`+`)[1].split(` `)[0]
}));

const AVAILABLE_OFFERS = {
  TAXI: getOfferObjects([
    `Add luggage +5 €`,
    `Switch to comfort class +50 €`
  ]),
  BUS: getOfferObjects([
    `Add luggage +10 €`,
    `Choose seats +10 €`
  ]),
  TRAIN: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`
  ]),
  SHIP: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`
  ]),
  TRANSPORT: getOfferObjects([
    `Add luggage +15 €`
  ]),
  DRIVE: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`
  ]),
  FLIGHT: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`,
    `Choose seats +20 €`
  ]),
  CHECK: getOfferObjects([
    `Switch to comfort class +200 €`,
    `Add meal +5 €`
  ]),
  SIGHTSEEING: getOfferObjects([
    `Choose seats +20 €`
  ]),
  RESTAURANT: getOfferObjects([
    `Choose seats +30 €`
  ])
};

const isSameOffers = (a, b) => a.type === b.type && a.title === b.title && a.price === b.price;




/***/ }),

/***/ "./src/utils/render.js":
/*!*****************************!*\
  !*** ./src/utils/render.js ***!
  \*****************************/
/*! exports provided: RenderPositions, createElement, render, replace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderPositions", function() { return RenderPositions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return createElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replace", function() { return replace; });
const RenderPositions = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const render = (container, element, place = RenderPositions.BEFOREEND) => {
  switch (place) {
    case RenderPositions.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPositions.BEFOREEND:
      container.append(element);
      break;
  }
};

const replace = (newComponent, oldComponent) => {
  if (!newComponent) {
    throw new Error(`Please, send new component as argument`);

  } else if (!oldComponent) {
    throw new Error(`Please, send old component as argument`);

  } else {
    const newElement = newComponent.getElement();
    const oldElement = oldComponent.getElement();
    const parentElement = oldElement.parentElement;

    if (parentElement) {
      parentElement.replaceChild(newElement, oldElement);
    }
  }
};




/***/ })

/******/ });
//# sourceMappingURL=bundle.2d54c0429838c817f1f7.js.map