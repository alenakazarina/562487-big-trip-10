import {createTripInfoMainTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripDaysListTemplate} from './components/trip-days-list';
import {createTripDayTemplate} from './components/trip-day';
import {createSortingTemplate} from './components/sorting';
import {createEditEventTemplate} from './components/edit-event-form';
import {generateEvents} from './mocks/events';
import {calculateCosts} from './components/header-total';
import {render} from './utils';

//  dates
const EVENTS_COUNT = 22;
const EVENTS_PER_DAY = 4;
const daysCount = (EVENTS_COUNT > EVENTS_PER_DAY) ? Math.round(EVENTS_COUNT / EVENTS_PER_DAY) : 1;

const generateDatesArray = (days) => {
  return new Array(days)
    .fill(``)
    .map(() => new Date())
    .map((date, i) => {
      date.setDate(date.getDate() + i);
      return date;
    });
};

const dates = generateDatesArray(daysCount);

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const sortByStartDate = (arr) => arr.sort((a, b) => a.startDate > b.startDate ? 1 : -1);

const events = generateEvents(EVENTS_COUNT, dates);
const sortedEvents = sortByStartDate(events);
const cities = new Set(sortedEvents.map((it) => it.destination));

const startTripDate = sortedEvents[0].startDate;
const endTripDate = sortedEvents[sortedEvents.length - 1].endDate;

render(tripInfoElement, createTripInfoMainTemplate(startTripDate, endTripDate, cities), `afterbegin`);
render(tripControlsElement.firstElementChild, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());
render(tripEventsElement.firstElementChild, createSortingTemplate(), `afterend`);

render(tripEventsElement, createTripDaysListTemplate());
const tripDaysElement = document.querySelector(`.trip-days`);

dates.forEach((date) => {
  const dayEvents = sortedEvents.filter((event) => event.startDate === date);
  const tripDayTemplate = createTripDayTemplate(date, dayEvents);
  render(tripDaysElement, tripDayTemplate);
});

const eventsListElement = document.querySelector(`.trip-events__list`);
render(eventsListElement, createEditEventTemplate(sortedEvents[0]), `afterbegin`);

const totalAmount = calculateCosts(sortedEvents);
const totalPriceContainer = document.querySelector(`.trip-info__cost-value`);
totalPriceContainer.innerHTML = ``;
render(totalPriceContainer, totalAmount);
