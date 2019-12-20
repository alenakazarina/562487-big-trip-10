import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import PointController from './point';
import {render} from '../utils/render';
import {SortType} from '../const';

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
    this._pointsModel = null;
    this._pointControllers = [];
    this._sortType = SortType.EVENT;

    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListElement = new TripDaysListComponent().getElement();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(pointsModel) {
    this._pointsModel = pointsModel;
    this._pointsModel.setSortTypeChangeHandlers(this._onSortTypeChange);
    const events = this._pointsModel.getPoints();
    const eventsDates = this._pointsModel.getPointsDates();

    if (!events.length) {
      this._renderNoPoints();
    } else {
      this._renderSort();
      this._renderTripDaysList();
      //  render
      this._pointControllers = renderTripDays(this._tripDaysListElement, eventsDates, events, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  _renderNoPoints() {
    render(this._container, this._noPointsComponent.getElement());
  }

  _renderSort() {
    render(this._container, this._sortComponent.getElement());
  }

  _renderTripDaysList() {
    render(this._container, this._tripDaysListElement);
  }

  _renderDayInfo() {
    this._sortComponent.getElement().children[0].innerHTML = `Day`;
  }

  _removeDayInfo() {
    this._sortComponent.getElement().children[0].innerHTML = ``;
    for (let child of this._tripDayComponent.getElement().children) {
      child.innerHTML = ``;
    }
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._pointsModel.setSort(sortType);
    const sortedEvents = this._pointsModel.getPoints();
    //  clean container
    this._tripDaysListElement.innerHTML = ``;

    //  remove Esc Listeners if exists
    const isEditMode = this._pointControllers.some((it) => it._mode === `edit`);
    if (isEditMode) {
      document.removeEventListener(`keydown`, this._pointControllers.find((it) => it._mode === `edit`)._onEscKeyPress);
    }

    //  render
    if (this._sortType !== `event`) {
      this._removeDayInfo();
      render(this._tripDaysListElement, this._tripDayComponent.getElement());
      this._pointControllers = renderEvents(sortedEvents, this._tripDayComponent.getElement().children[1], this._onDataChange, this._onViewChange);
    } else {
      this._renderDayInfo();
      this._pointControllers = renderTripDays(this._tripDaysListElement, this._eventsDates, sortedEvents, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  //  update this._events with newEvent
  _onDataChange(pointController, oldEvent, newEvent) {
    const isUpdated = this._pointsModel.updatePoint(oldEvent.id, newEvent);
    if (isUpdated) {
      pointController.render(newEvent);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}

export default TripController;
