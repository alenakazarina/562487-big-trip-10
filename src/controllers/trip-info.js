import TripInfoMainComponent from '../components/trip-info-main';
import TripInfoCostComponent from '../components/trip-info-cost';
import {render} from '../utils/render';

class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;

    this._updateInfo = this._updateInfo.bind(this);
    this._pointsModel.addDataChangeHandler(this._updateInfo);
  }

  render() {
    this._tripInfoMainComponent = new TripInfoMainComponent(this._pointsModel.getPoints());
    this._tripInfoCostComponent = new TripInfoCostComponent(this._pointsModel.getCostsAmount());
    render(this._container, this._tripInfoMainComponent.getElement());
    render(this._container, this._tripInfoCostComponent.getElement());
  }

  _updateInfo() {
    this._tripInfoMainComponent.update(this._pointsModel.getPoints());
    this._tripInfoCostComponent.update(this._pointsModel.getCostsAmount());
  }
}

export default TripInfoController;
