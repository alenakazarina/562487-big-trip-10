import {createElement} from '../utils';

const createTripDaysListTemplate = () => {
  return `
    <ul class="trip-days"></ul>
  `;
};

class TripDaysList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripDaysList;
