import AbstractComponent from './abstract-component';
import {sanitizeTemplate} from '../utils/render';

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
    const template = createTripInfoCostTemplate(this._costsAmount);
    return sanitizeTemplate(template);
  }
}

export default TripInfoCost;
