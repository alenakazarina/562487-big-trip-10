import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import AddEventButtonComponent from '../components/add-event-button';
import PointController from './point';
import {render} from '../utils/render';
import {isSameDay} from '../utils/common';
import {SortType, Mode} from '../const';

const HIDE_CLASS = `trip-events--hidden`;

const Message = {
  LOADING: `Loading...`,
  NO_POINTS: `Click New Event to create your first point`,
  FILTER_NO_POINTS: `No events =(`,
};

class TripController {
  constructor(container, pointsModel, api) {
    this._pointsModel = pointsModel;
    this._destinations = [];
    this._offers = [];
    this._api = api;

    this._pointControllers = [];
    this._sortType = SortType.EVENT;

    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();
    this._addEventButtonComponent = new AddEventButtonComponent();
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
    this._api.getPoints().then((points) => {
      this._renderAddEventButton();
      this._pointsModel.setPoints(points);
      const events = this._pointsModel.getPoints();

      const isNoPoints = events.length === 0;
      render(this._container, this._noPointsComponent.getElement());
      if (isNoPoints) {
        this._noPointsComponent.setMessage(Message.NO_POINTS);
        this._noPointsComponent.show();
        return;
      } else {
        this._noPointsComponent.setMessage(Message.LOADING);
        this._noPointsComponent.show();
        this._renderPoints();
      }
    });
  }

  show() {
    this._container.classList.remove(HIDE_CLASS);
  }

  hide() {
    this._container.classList.add(HIDE_CLASS);
  }

  _renderPoints() {
    Promise.all([this._api.getDestinations(), this._api.getOffers()]).then((data) => {
      const [destinations, offers] = data;
      this._destinations = destinations;
      this._offers = offers;
      const events = this._pointsModel.getPoints();
      const eventsDates = this._pointsModel.getPointsDates(events);

      this._noPointsComponent.hide();
      render(this._container, this._sortComponent.getElement());
      render(this._container, this._tripDaysListComponent.getElement());
      this._pointControllers = this._renderTripDays(this._tripDaysListComponent.getElement(), eventsDates, events)
      .reduce((days, day) => days.concat(day), []);
    });
  }

  _renderAddEventForm() {
    const isEmptyDestinations = this._destinations.length === 0;
    const isEmptyOffers = this._offers.length === 0;
    if (isEmptyDestinations && isEmptyOffers) {
      Promise.all([this._api.getDestinations(), this._api.getOffers()]).then((data) => {
        const [destinations, offers] = data;
        this._destinations = destinations;
        this._offers = offers;
        this._createAddEventForm();
      });
      return;
    }
    this._createAddEventForm();
  }

  _createAddEventForm() {
    this._onViewChange();
    this._pointControllers.forEach((it) => it.setOpenButton(true));
    this._noPointsComponent.hide();

    this._addEventButtonComponent.setDisabled(true);
    this._newEventId = this._pointsModel.getPoints().length;
    this._addEventFormController = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._addEventFormController.render(this._newEventId, {}, this._destinations, this._offers, Mode.ADD);
  }

  _renderAddEventButton() {
    const tripMainElement = document.querySelector(`.trip-main`);
    render(tripMainElement, this._addEventButtonComponent.getElement());
    this._addEventButtonComponent.setClickHandler(() => {
      this._renderAddEventForm();
    });
  }

  _renderEvents(events, container) {
    return events.map((event) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(event.id, event, this._destinations, this._offers, Mode.VIEW);
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

  _renderEventsList(events) {
    this._removeDayInfo();
    render(this._tripDaysListComponent.getElement(), this._tripDayComponent.getElement());
    this._pointControllers = this._renderEvents(events, this._tripDayComponent.getElement().children[1]);
  }

  _renderEventsListWithDays(events, eventsDates) {
    this._sortComponent.getElement().children[0].innerHTML = `Day`;
    this._pointControllers = this._renderTripDays(this._tripDaysListComponent.getElement(), eventsDates, events)
      .reduce((days, day) => days.concat(day), []);
  }

  _renderWithSortType() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
    this._removeEscListenersIfExists();

    const isAnyPoints = this._pointsModel.getPointsLength();

    if (isAnyPoints) {
      const events = this._pointsModel.getPoints();
      if (events.length === 0) {
        this._showMessage(Message.FILTER_NO_POINTS);
        return;
      }

      this._noPointsComponent.hide();
      this._sortComponent.show();

      if (this._sortType === SortType.EVENT) {
        const eventsDates = this._pointsModel.getPointsDates(events);
        this._renderEventsListWithDays(events, eventsDates);
        return;
      } else {
        this._renderEventsList(events);
        return;
      }
    } else {
      this._showMessage(Message.NO_POINTS);
    }
  }

  _showMessage(text) {
    this._sortComponent.hide();
    this._noPointsComponent.setMessage(text);
    this._noPointsComponent.show();
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
      })
      .catch(() => {
        pointController.shake();
      });
    }

    if (oldEvent === null) {
      this._api.createPoint(newEvent).then((point) => {
        this._pointsModel.addPoint(point);
        this._onViewChange();
        return;
      })
      .catch(() => {
        pointController.shake();
      });
    }
    if (newEvent && oldEvent) {
      this._api.updatePoint(oldEvent.id, newEvent).then((point) => {
        this._pointsModel.updatePoint(point.id, point);
        pointController.setDefaultView();
      }).catch(() => {
        pointController.shake();
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
    if (this._addEventFormController) {
      this._addEventButtonComponent.setDisabled(false);
      this._addEventFormController.destroy();
      this._pointControllers.forEach((it) => it.setOpenButton(false));
      if (this._pointsModel.getPoints().length === 0) {
        this._noPointsComponent.setMessage(Message.NO_POINTS);
      } else {
        this._noPointsComponent.setMessage(Message.LOADING);
      }
    }
  }
}

export default TripController;
