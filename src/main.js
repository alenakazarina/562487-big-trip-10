import {createTripInfoMainTemplate} from './components/trip-info-main';
import {createTripInfoCostTemplate} from './components/trip-info-cost';
import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripDaysListTemplate} from './components/trip-days-list';
import {createTripDayTemplate} from './components/trip-day';
import {createSortingTemplate} from './components/sorting';
import {createEditEventTemplate} from './components/edit-event-form';
import {render} from './utils';
import {generateEvents} from './mocks/events';
import {generateDatesArray} from './mocks/dates';
import {generateFilters} from './mocks/filters';

const EVENTS_COUNT = 22;
const DAYS_COUNT = 4;

const sortByStartDate = (arr) => arr.map((it) => it).sort((a, b) => a.startDate > b.startDate ? 1 : -1);

const randomDates = generateDatesArray(DAYS_COUNT);
const events = generateEvents(EVENTS_COUNT, randomDates);
const filters = generateFilters();

const sortedEvents = sortByStartDate(events);
const eventsDates = Array.from(new Set(sortedEvents.map((event) => event.startDate)));
const cities = new Set(sortedEvents.map((it) => it.destination));
const startTripDate = sortedEvents[0].startDate;
const endTripDate = sortedEvents[sortedEvents.length - 1].endDate;

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripInfoMainTemplate(startTripDate, endTripDate, cities));
render(tripInfoElement, createTripInfoCostTemplate(events));

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripControlsElement.firstElementChild, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate(filters));
render(tripEventsElement.firstElementChild, createSortingTemplate(), `afterend`);

render(tripEventsElement, createTripDaysListTemplate());
const tripDaysElement = document.querySelector(`.trip-days`);

for (let i = 0; i < eventsDates.length; i++) {
  const date = eventsDates[i];
  const dayEvents = sortedEvents.filter((event) => event.startDate === date);
  const tripDayTemplate = createTripDayTemplate(date, dayEvents, i);
  render(tripDaysElement, tripDayTemplate);
}

const eventsListElement = document.querySelector(`.trip-events__list`);
render(eventsListElement, createEditEventTemplate(sortedEvents[0]), `afterbegin`);
