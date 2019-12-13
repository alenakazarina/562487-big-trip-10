import SortComponent, {sortTypes} from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import PointController from './point';
import {render} from '../utils/render';

const renderEvents = (events, container, onDataChange, onViewChange) => {
  return events.map((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(event);

    return pointController;
  });
};

const renderTripDays = (container, eventsDates, events, onDataChange, onViewChange) => {
  return eventsDates.map((day, i) => {
    const dayEvents = events.filter((event) => event.startDate === day);
    const tripDayComponent = new TripDayComponent(day, dayEvents, i);

    render(container, tripDayComponent.getElement());
    return renderEvents(dayEvents, tripDayComponent.getElement().children[1], onDataChange, onViewChange);
  });
};

class TripController {
  constructor(container) {
    this._events = [];
    this._eventsDates = [];
    this._pointControllers = [];
    this._sortType = `event`;

    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events.map((event) => Object.assign({}, event, {isFavorite: false}));

    this._eventsDates = this._events.map((event) => event.startDate)
      .filter((date, i, arr) => arr.slice(i + 1, arr.length).every((it) => it !== date));

    if (!this._events.length) {
      render(this._container, this._noPointsComponent.getElement());

    } else {
      const tripDaysListElement = this._tripDaysListComponent.getElement();

      render(this._container, this._sortComponent.getElement());
      render(this._container, tripDaysListElement);
      //  render
      this._pointControllers = renderTripDays(tripDaysListElement, this._eventsDates, this._events, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  _onSortTypeChange(sortType) {
    //  sort events by sortType
    this._sortType = sortType;
    const sortedEvents = Object.values(sortTypes).find((it) => it.id === this._sortType).sortFn(this._events);
    //  clean container
    const tripDaysListElement = this._tripDaysListComponent.getElement();
    tripDaysListElement.innerHTML = ``;

    //  remove Esc Listeners if exists
    const isEditMode = this._pointControllers.some((it) => it._mode === `edit`);
    if (isEditMode) {
      document.removeEventListener(`keydown`, this._pointControllers.find((it) => it._mode === `edit`)._onEscKeyPress);
    }

    //  render
    if (this._sortType !== `event`) {
      this._sortComponent.getElement().children[0].innerHTML = ``;
      for (let child of this._tripDayComponent.getElement().children) {
        child.innerHTML = ``;
      }
      render(tripDaysListElement, this._tripDayComponent.getElement());
      this._pointControllers = renderEvents(sortedEvents, this._tripDayComponent.getElement().children[1], this._onDataChange, this._onViewChange);
    } else {
      this._sortComponent.getElement().children[0].innerHTML = `Day`;
      this._pointControllers = renderTripDays(tripDaysListElement, this._eventsDates, sortedEvents, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  //  update this._events with newEvent
  _onDataChange(pointController, oldEvent, newEvent) {
    const i = this._events.findIndex((it) => it === oldEvent);
    if (i !== -1) {
      this._events[i] = newEvent;
    }

    pointController.render(newEvent);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}

export default TripController;
