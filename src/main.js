import MenuComponent from './components/menu';
import StatisticsComponent from './components/statistics';
import TripInfoController from './controllers/trip-info';
import TripController from './controllers/trip';
import FiltersController from './controllers/filters';
import PointsModel from './models/points';
import {render} from './utils/render';
import {showModalOnError} from './utils/common';
import {MenuTab} from './const';
import API from './api';
import APIWithProvider from './api/provider';
import Store from './api/store';

const AUTHORIZATION = `Basic jVVgasSyGBHpa29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const StoreName = {
  POINTS: `bigtrip-points`,
  DESTINATIONS: `bigtrip-destinations`,
  OFFERS: `bigtrip-offers`,
};

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(StoreName, window.localStorage);
const apiWithProvider = new APIWithProvider(api, store);

const pointsModel = new PointsModel();

const tripMainElement = document.querySelector(`.trip-main`);
const menuComponent = new MenuComponent();
render(tripMainElement.children[1], menuComponent.getElement());

const tripInfoController = new TripInfoController(tripMainElement.children[0], pointsModel);
tripInfoController.render();

const filtersController = new FiltersController(tripMainElement.children[1], pointsModel);
filtersController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel, apiWithProvider);
tripController.render();

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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then((points) => {
        pointsModel.setPoints(points);
      })
      .catch((err) => {
        showModalOnError(err);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

