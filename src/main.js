import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripController from './controllers/trip-controller';
import {render} from './utils/render';
import {generateEvents} from './mocks/events';
import {generateFilters} from './mocks/filters';

const EVENTS_COUNT = 22;
const DAYS_COUNT = 4;

const sortByStartDate = (arr) => arr.map((it) => it).sort((a, b) => a.startDate > b.startDate ? 1 : -1);

const events = generateEvents(EVENTS_COUNT, DAYS_COUNT);
const filters = generateFilters(events);

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = tripInfoElement.nextElementSibling;


const sortedEvents = events.length ? sortByStartDate(events) : events;

render(tripInfoElement, new TripInfoMainComponent(sortedEvents).getElement());
render(tripInfoElement, new TripInfoCostComponent(sortedEvents).getElement());

render(tripControlsElement, new MenuComponent().getElement());
render(tripControlsElement, new FiltersComponent(filters).getElement());


const tripController = new TripController(document.querySelector(`.trip-events`));
tripController.render(sortedEvents);
