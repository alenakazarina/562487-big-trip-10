import MenuComponent from './components/menu';
import AddEventButtonComponent from './components/add-event-button';
import StatisticsComponent from './components/statistics';
import TripInfoController from './controllers/trip-info';
import TripController from './controllers/trip';
import FiltersController from './controllers/filters';
import PointsModel from './models/points';
import DestinationsModel from './models/destinations';
import OffersModel from './models/offers';
import {render} from './utils/render';
import {MenuTab} from './const';

import API from './api';

const AUTHORIZATION = `Basic lJDlckLoPXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const tripMainElement = document.querySelector(`.trip-main`);

const menuComponent = new MenuComponent();
render(tripMainElement.children[1], menuComponent.getElement());

const tripInfoController = new TripInfoController(tripMainElement.children[0], pointsModel);
tripInfoController.render();

const filtersController = new FiltersController(tripMainElement.children[1], pointsModel);
filtersController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel, destinationsModel, offersModel, api);

const addEventButtonComponent = new AddEventButtonComponent();
render(tripMainElement, addEventButtonComponent.getElement());

addEventButtonComponent.setClickHandler(() => {
  tripController.renderAddEventForm(addEventButtonComponent);
});

const statisticsComponent = new StatisticsComponent(pointsModel);
render(document.querySelector(`.trip-events`).parentElement, statisticsComponent.getElement());
statisticsComponent.hide();

menuComponent.setClickHandler((evt) => {
  menuComponent.setActiveTab(evt.target);
  if (evt.target.value === MenuTab.TABLE) {
    tripController.show();
    statisticsComponent.hide();
  } else {
    tripController.hide();
    statisticsComponent.show();
  }
});

Promise.all([api.getPoints(), api.getDestinations(), api.getOffers()]).then((data) => {
  const [points, destinations, offers] = data;
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(points);

  tripController.render();
});

