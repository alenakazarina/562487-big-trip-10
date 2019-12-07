import TripInfoMainComponent from './components/trip-info-main';
import TripInfoCostComponent from './components/trip-info-cost';
import MenuComponent from './components/menu';
import FiltersComponent from './components/filters';
import TripDaysListComponent from './components/trip-days-list';
import TripDayComponent from './components/trip-day';
import SortingComponent from './components/sorting';
import EventComponent from './components/event';
import EditEventFormComponent from './components/edit-event-form';
import NoPointsComponent from './components/no-points';
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

const tripInfoElement = document.querySelector(`.trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripControlsElement, new MenuComponent().getElement());
render(tripControlsElement, new FiltersComponent(filters).getElement());

if (!events.length) {
  render(tripInfoElement, new TripInfoMainComponent(events).getElement());
  render(tripInfoElement, new TripInfoCostComponent(events).getElement());

  render(tripEventsElement, new NoPointsComponent().getElement());
} else {
  const sortedEvents = sortByStartDate(events);
  const eventsDates = Array.from(new Set(sortedEvents.map((event) => event.startDate)));

  render(tripInfoElement, new TripInfoMainComponent(sortedEvents).getElement());
  render(tripInfoElement, new TripInfoCostComponent(sortedEvents).getElement());

  render(tripEventsElement, new SortingComponent().getElement());
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
      document.removeEventListener(`keydown`, onEscKeyPress);
    };

    const onEscKeyPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replaceFormToEvent(eventElement, editEventElement);
      }
    };

    const replaceEventToForm = (eventTemplate, form) => {
      container.replaceChild(form, eventTemplate);
      document.addEventListener(`keydown`, onEscKeyPress);
    };

    eventRollupButton.addEventListener(`click`, () => {
      replaceEventToForm(eventElement, editEventElement);
    });

    formRollupButton.addEventListener(`click`, () => {
      replaceFormToEvent(eventElement, editEventElement);
    });

    editEventFormElement.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
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
}
