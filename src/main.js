import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripDaysListComponent from './components/trip-days-list';
import TripDayComponent from './components/trip-day';
import SortingComponent from './components/sorting';
import EventComponent from './components/event';
import EditEventFormComponent from './components/edit-event-form';
import {RenderPositions, render} from './utils';
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
render(tripInfoElement, new TripInfoMainComponent(startTripDate, endTripDate, cities).getElement());
render(tripInfoElement, new TripInfoCostComponent(events).getElement());

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripControlsElement.firstElementChild, new MenuComponent().getElement(), RenderPositions.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent(filters).getElement());
render(tripEventsElement.firstElementChild, new SortingComponent().getElement(), RenderPositions.AFTERBEGIN);

render(tripEventsElement, new TripDaysListComponent().getElement());
const tripDaysElement = document.querySelector(`.trip-days`);

const renderEvent = (event, container) => {
  const eventElement = new EventComponent(event).getElement();
  const editEventElement = new EditEventFormComponent(event).getElement();

  const editEventFormElement = editEventElement.querySelector(`form`);
  const eventRollupButton = eventElement.querySelector(`.event__rollup-btn`);
  const formRollupButton = editEventFormElement.querySelector(`.event__rollup-btn`);


  const replaceFormToEvent = (eventTemplate, form) => {
    container.replaceChild(eventTemplate, form);
  };

  const replaceEventToForm = (eventTemplate, form) => {
    container.replaceChild(form, eventTemplate);
  };

  eventRollupButton.addEventListener(`click`, () => {
    replaceEventToForm(eventElement, editEventElement);
  });

  formRollupButton.addEventListener(`click`, () => {
    replaceFormToEvent(eventElement, editEventElement);
  });

  editEventFormElement.addEventListener(`submit`, () => {
    replaceFormToEvent(editEventElement, eventElement);
  });
  render(container, eventElement);
};

eventsDates.forEach((day, i) => {
  const dayEvents = sortedEvents.filter((event) => event.startDate === day);
  //  render eventslistElement
  render(tripDaysElement, new TripDayComponent(day, dayEvents, i).getElement());

  //  render events
  dayEvents.forEach((event) => {
    const eventListElement = tripDaysElement.querySelectorAll(`.trip-events__list`)[i];
    renderEvent(event, eventListElement);
  });
});
