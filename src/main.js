import {createTripInfoMainTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTripDaysListTemplate} from './components/trip-days-list';
import {createTripDayTemplate} from './components/trip-day';
import {createSortingTemplate} from './components/sorting';
import {createAddEventTemplate} from './components/add-event-form';
import {createEditEventTemplate} from './components/edit-event-form';

const COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, createTripInfoMainTemplate(), `afterbegin`);
render(tripControlsElement.firstElementChild, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());
render(tripEventsElement.firstElementChild, createSortingTemplate(), `afterend`);
render(tripEventsElement, createAddEventTemplate());
render(tripEventsElement, createTripDaysListTemplate());

const tripDaysElement = document.querySelector(`.trip-days`);

for (let i = 0; i < COUNT; i++) {
  render(tripDaysElement, createTripDayTemplate(i + 1));
}

const eventsListElement = document.querySelector(`.trip-events__list`);
render(eventsListElement, createEditEventTemplate(), `afterbegin`);


