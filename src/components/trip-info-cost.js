import {createElement} from '../utils';

const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

const calculateCosts = (events) => {
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

class TripInfoCost {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._events);
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

export default TripInfoCost;
