import TripInfoMainComponent from '../components/trip-info-main';
import TripInfoCostComponent from '../components/trip-info-cost';
import {render, replace} from '../utils/render';

class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.addDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldTripInfoMainComponent = this._tripInfoMainComponent;
    const oldTripInfoCostComponent = this._tripInfoCostComponent;
    this._tripInfoMainComponent = new TripInfoMainComponent(this._pointsModel.getPoints());
    this._tripInfoCostComponent = new TripInfoCostComponent(this._pointsModel.getCostsAmount());

    if (oldTripInfoMainComponent && oldTripInfoCostComponent) {
      replace(this._tripInfoMainComponent, oldTripInfoMainComponent);
      replace(this._tripInfoCostComponent, oldTripInfoCostComponent);
    } else {
      render(this._container, this._tripInfoMainComponent.getElement());
      render(this._container, this._tripInfoCostComponent.getElement());
    }
  }

  _onDataChange() {
    this.render();
  }
}

export default TripInfoController;
