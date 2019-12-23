import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import PointController from './point';
import {render} from '../utils/render';
import {isSameDay} from '../utils/common';
import {SortType, Mode} from '../const';

const getDefaultEvent = (newEventId) => {
  return ({
    id: newEventId,
    type: `activity`,
    name: `Sightseeing`,
    icon: `sightseeing.png`,
    startDate: new Date(),
    endDate: new Date(),
    destination: ``,
    price: 0,
    description: ``,
    photos: [],
    offers: []
  });
};

const renderEvents = (events, container, onDataChange, onViewChange) => {
  return events.map((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(event, Mode.VIEW);
    return pointController;
  });
};

const renderTripDays = (container, eventsDates, events, onDataChange, onViewChange) => {
  return eventsDates.map((day, i) => {
    const dayEvents = events.filter((event) => isSameDay(event.startDate, day));
    const tripDayComponent = new TripDayComponent(day, dayEvents, i);
    render(container, tripDayComponent.getElement());
    return renderEvents(dayEvents, tripDayComponent.getElement().children[1], onDataChange, onViewChange);
  });
};

class TripController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._sortType = SortType.EVENT;

    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListElement = new TripDaysListComponent().getElement();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();
    this._addEventButtonComponent = null;
    this._newEventId = 0;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onAddFormCancel = this._onAddFormCancel.bind(this);
    this._onAddFormSubmit = this._onAddFormSubmit.bind(this);
    this._renderWithSortType = this._renderWithSortType.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addFilterChangeHandler(this._renderWithSortType);
    this._pointsModel.addDataChangeHandler(this._renderWithSortType);
  }

  render() {
    const events = this._pointsModel.getPoints();
    const eventsDates = this._pointsModel.getPointsDates(events);

    if (!events.length) {
      render(this._container, this._noPointsComponent.getElement());
    } else {
      render(this._container, this._sortComponent.getElement());
      render(this._container, this._tripDaysListElement);
      this._pointControllers = renderTripDays(this._tripDaysListElement, eventsDates, events, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  renderAddEventForm(addEventButtonComponent) {
    this._onViewChange();
    this._pointControllers.forEach((it) => it.disableOpenButton());

    this._addEventButtonComponent = addEventButtonComponent;
    this._addEventButtonComponent.disable();

    this._newEventId = this._pointsModel.getPoints().length + 1;
    const defaultEvent = getDefaultEvent(this._newEventId);

    this._addEventFormController = new PointController(this._container, this._onAddFormSubmit, this._onAddFormCancel);
    this._addEventFormController.render(defaultEvent, Mode.ADD);
  }

  _renderWithSortType() {
    this._tripDaysListElement.innerHTML = ``;
    this._removeEscListenersIfExists();

    const events = this._pointsModel.getPoints();
    const eventsDates = this._pointsModel.getPointsDates(events);

    if (this._sortType !== SortType.EVENT) {
      this._removeDayInfo();
      render(this._tripDaysListElement, this._tripDayComponent.getElement());
      this._pointControllers = renderEvents(events, this._tripDayComponent.getElement().children[1], this._onDataChange, this._onViewChange);
    } else {
      this._sortComponent.getElement().children[0].innerHTML = `Day`;
      this._pointControllers = renderTripDays(this._tripDaysListElement, eventsDates, events, this._onDataChange, this._onViewChange)
        .reduce((days, day) => days.concat(day), []);
    }
  }

  _removeDayInfo() {
    this._sortComponent.getElement().children[0].innerHTML = ``;
    for (let child of this._tripDayComponent.getElement().children) {
      child.innerHTML = ``;
    }
  }

  _removePointControllers() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _removePointController(pointController, i) {
    pointController.destroy();
    this._pointControllers = [].concat(this._pointControllers.slice(0, i), this._pointControllers.slice(i + 1));
  }

  _removePoint(pointController, id) {
    const isDayEmpty = pointController.getContainer().children.length - 1 === 0;

    this._pointsModel.removePoint(id);

    this._removePointController(pointController, id);

    if (isDayEmpty && this._sortType === SortType.EVENT) {
      this._renderWithSortType();
    }
  }

  _removeEscListenersIfExists() {
    const isEditMode = this._pointControllers.some((it) => it._mode === Mode.EDIT);
    if (isEditMode) {
      document.removeEventListener(`keydown`, this._pointControllers.find((it) => it._mode === `edit`)._onEscKeyPress);
    }
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._pointsModel.setSort(sortType);
    this._renderWithSortType();
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    if (newEvent === null) {
      this._removePoint(pointController, oldEvent.id);
      return;
    }

    if (oldEvent === null) {
      this._addPoint();
      return;
    }

    const isUpdated = this._pointsModel.updatePoint(oldEvent.id, newEvent);
    if (isUpdated) {
      pointController.render(newEvent);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onAddFormCancel() {
    this._addEventButtonComponent.enable();
    this._addEventFormController.destroy();
    this._pointControllers.forEach((it) => it.enableOpenButton());
  }

  _onAddFormSubmit(evt) {
    evt.preventDefault();
    const newPoint = this._addEventFormController.getFormData();
    this._pointsModel.addPoint(newPoint);
    this._onAddFormCancel();
    this._renderWithSortType();
  }
}

export default TripController;
