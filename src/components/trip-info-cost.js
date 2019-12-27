import AbstractComponent from './abstract-component';

const createTripInfoCostTemplate = (costsAmount) => {
  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${costsAmount}</span>
    </p>
  `;
};

class TripInfoCost extends AbstractComponent {
  constructor(costsAmount) {
    super();
    this._costsAmount = costsAmount;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._costsAmount);
  }

  update(amount) {
    this._costsAmount = amount;
    this.getElement().querySelector(`.trip-info__cost-value`).innerHTML = amount;
  }
}

export default TripInfoCost;
