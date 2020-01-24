import StatisticsComponent from './components/statistics';
import TripInfoController from './controllers/trip-info';
import TripController from './controllers/trip';
import TripControlsController from './controllers/trip-controls';
import PointsModel from './models/points';
import {render} from './utils/render';
import {showModalOnError} from './utils/common';
import {SortType, FilterType, MenuTab} from './const';
import API from './api';
import APIWithProvider from './api/provider';
import Store from './api/store';

const AUTHORIZATION = `Basic jLZgasSyKIDpa29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const InitialData = {
  SORT_TYPE: SortType.EVENT,
  FILTER_TYPE: FilterType.EVERYTHING,
  MENU_TAB: MenuTab.TABLE
};

const StoreName = {
  POINTS: `bigtrip-points`,
  DESTINATIONS: `bigtrip-destinations`,
  OFFERS: `bigtrip-offers`
};

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(StoreName, window.localStorage);
const apiWithProvider = new APIWithProvider(api, store);

const pointsModel = new PointsModel(InitialData.FILTER_TYPE, InitialData.SORT_TYPE);

const tripMainElement = document.querySelector(`.trip-main`);

const tripInfoController = new TripInfoController(tripMainElement.children[0], pointsModel);
tripInfoController.render();

const tripControlsController = new TripControlsController(tripMainElement.children[1], pointsModel, InitialData);
tripControlsController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel, apiWithProvider, InitialData.SORT_TYPE);
tripController.render();

const statisticsComponent = new StatisticsComponent(pointsModel);
render(document.querySelector(`.trip-events`).parentElement, statisticsComponent.getElement());
statisticsComponent.hide();

tripControlsController.setViewsToChange(() => {
  return [statisticsComponent, tripController];
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

