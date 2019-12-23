import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import AddEventButtonComponent from './components/add-event-button';
import TripController from './controllers/trip';
import FiltersController from './controllers/filters';
import PointsModel from './models/points';
import {render} from './utils/render';
import {generateEvents} from './mocks/events';


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

render(tripMainElement.children[1], new MenuComponent().getElement());

const addEventButtonComponent = new AddEventButtonComponent();
render(tripMainElement, addEventButtonComponent.getElement());

const filtersController = new FiltersController(tripControlsElement, pointsModel);
filtersController.render();

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel);
tripController.render();

addEventButtonComponent.setClickHandler(() => {
  tripController.renderAddEventForm(addEventButtonComponent);
});
