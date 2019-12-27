import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import PointController from './point';
import {render, remove} from '../utils/render';
import {isSameDay} from '../utils/common';
import {SortType, Mode} from '../const';

const HIDE_CLASS = `trip-events--hidden`;

class TripController {
  constructor(container, pointsModel, destinationsModel, offersModel, api) {
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;

    this._pointControllers = [];
    this._sortType = SortType.EVENT;

    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();
    this._addEventButtonComponent = null;
    this._newEventId = 0;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._renderWithSortType = this._renderWithSortType.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addFilterChangeHandler(this._renderWithSortType);
    this._pointsModel.addDataChangeHandler(this._renderWithSortType);
  }

  render() {
    const events = this._pointsModel.getPoints();
    const eventsDates = this._pointsModel.getPointsDates(events);

    if (events.length) {
      render(this._container, this._sortComponent.getElement());
      render(this._container, this._tripDaysListComponent.getElement());
      this._pointControllers = this._renderTripDays(this._tripDaysListComponent.getElement(), eventsDates, events)
        .reduce((days, day) => days.concat(day), []);
    } else {
      render(this._container, this._noPointsComponent.getElement());
      return;
    }
  }

  renderAddEventForm(addEventButtonComponent) {
    this._onViewChange();
    this._pointControllers.forEach((it) => it.setOpenButton(true));
    this._addEventButtonComponent = addEventButtonComponent;
    this._addEventButtonComponent.setDisabled(true);

    this._newEventId = this._pointsModel.getPoints().length;
    this._addEventFormController = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._addEventFormController.render(this._newEventId, {}, this._destinationsModel, this._offersModel, Mode.ADD);
  }

  show() {
    this._container.classList.remove(HIDE_CLASS);
  }

  hide() {
    this._container.classList.add(HIDE_CLASS);
  }

  _renderEvents(events, container) {
    return events.map((event) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(event.id, event, this._destinationsModel, this._offersModel, Mode.VIEW);
      return pointController;
    });
  }

  _renderTripDays(container, eventsDates, events) {
    return eventsDates.map((day, i) => {
      const dayEvents = events.filter((event) => isSameDay(event.startDate, day));
      const tripDayComponent = new TripDayComponent(day, dayEvents, i);
      render(container, tripDayComponent.getElement());
      return this._renderEvents(dayEvents, tripDayComponent.getElement().children[1]);
    });
  }

  _renderWithSortType() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
    this._removeEscListenersIfExists();

    const events = this._pointsModel.getPoints();
    const eventsDates = this._pointsModel.getPointsDates(events);
    if (events.length) {
      this._sortComponent.show();
      remove(this._noPointsComponent);

      if (this._sortType === SortType.EVENT) {
        this._sortComponent.getElement().children[0].innerHTML = `Day`;
        this._pointControllers = this._renderTripDays(this._tripDaysListComponent.getElement(), eventsDates, events)
          .reduce((days, day) => days.concat(day), []);
      } else {
        this._removeDayInfo();
        render(this._tripDaysListComponent.getElement(), this._tripDayComponent.getElement());
        this._pointControllers = this._renderEvents(events, this._tripDayComponent.getElement().children[1]);
      }
    } else {
      this._sortComponent.hide();
      render(this._container, this._noPointsComponent.getElement());
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
    const isNoPoints = this._pointsModel.getPoints().length === 0;
    this._pointsModel.removePoint(id);
    this._removePointController(pointController, id);

    if (isNoPoints || isDayEmpty && this._sortType === SortType.EVENT) {
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
      this._api.deletePoint(oldEvent.id).then(() => {
        this._removePoint(pointController, oldEvent.id);
        return;
      });
    }

    if (oldEvent === null) {
      this._api.createPoint(newEvent).then((point) => {
        this._pointsModel.addPoint(point);
        this._onViewChange();
        return;
      });
    }
    if (newEvent && oldEvent) {
      this._api.updatePoint(oldEvent.id, newEvent).then((point) => {
        this._pointsModel.updatePoint(point.id, point);
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
    if (this._addEventFormController) {
      this._addEventButtonComponent.setDisabled(false);
      this._addEventFormController.destroy();
      this._pointControllers.forEach((it) => it.setOpenButton(false));
    }
  }
}

export default TripController;
