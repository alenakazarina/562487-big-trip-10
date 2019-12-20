import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripController from './controllers/trip';
import PointsModel from './models/points';
import {render} from './utils/render';
import {generateEvents} from './mocks/events';
import {generateFilters} from './mocks/filters';

const EVENTS_COUNT = 22;
const DAYS_COUNT = 4;

const events = generateEvents(EVENTS_COUNT, DAYS_COUNT);
const filters = generateFilters(events);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);
const points = pointsModel.getPoints();

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = tripInfoElement.nextElementSibling;

render(tripInfoElement, new TripInfoMainComponent(points).getElement());
render(tripInfoElement, new TripInfoCostComponent(points).getElement());

render(tripControlsElement, new MenuComponent().getElement());
render(tripControlsElement, new FiltersComponent(filters).getElement());

const tripController = new TripController(document.querySelector(`.trip-events`));
tripController.render(pointsModel);
