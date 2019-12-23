import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import AddEventButtonComponent from './components/add-event-button';
import StatisticsComponent from './components/statistics';
import TripController from './controllers/trip';
import FiltersController from './controllers/filters';
import PointsModel from './models/points';
import {render} from './utils/render';
import {generateEvents} from './mocks/events';
import {MenuTab} from './const';


const EVENTS_COUNT = 22;
const DAYS_COUNT = 4;

const events = generateEvents(EVENTS_COUNT, DAYS_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);
const points = pointsModel.getPoints();

const tripMainElement = document.querySelector(`.trip-main`);

const tripInfoElement = tripMainElement.children[0];
const tripControlsElement = tripMainElement.children[1];

render(tripInfoElement, new TripInfoMainComponent(points).getElement());
render(tripInfoElement, new TripInfoCostComponent(points).getElement());

const menuComponent = new MenuComponent();
render(tripMainElement.children[1], menuComponent.getElement());

const addEventButtonComponent = new AddEventButtonComponent();
render(tripMainElement, addEventButtonComponent.getElement());

const filtersController = new FiltersController(tripControlsElement, pointsModel);
filtersController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel);
tripController.render();

addEventButtonComponent.setClickHandler(() => {
  tripController.renderAddEventForm(addEventButtonComponent);
});

const statisticsComponent = new StatisticsComponent(pointsModel);
render(document.querySelector(`.trip-events`).parentElement, statisticsComponent.getElement());

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

