import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import NoPointsComponent from '../components/no-points';
import AddEventButtonComponent from '../components/add-event-button';
import PointController from './point';
import {render, remove} from '../utils/render';
import {SortType, Mode} from '../const';

const HIDE_CLASS = `trip-events--hidden`;

const Message = {
  LOADING: `Loading...`,
  NO_POINTS: `Click New Event to create your first point`
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
    this._tripDaysListComponent = null;
    this._noPointsComponent = new NoPointsComponent();
    this._addEventButtonComponent = new AddEventButtonComponent();
    this._newEventId = 0;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._renderWithSortType = this._renderWithSortType.bind(this);
    this._renderEventsList = this._renderEventsList.bind(this);
    this._createAddEventForm = this._createAddEventForm.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addFilterChangeHandler(this._renderWithSortType);
    this._pointsModel.addDataChangeHandler(this._renderWithSortType);
  }

  render() {
    this._renderNoPoints(Message.LOADING);
    this._renderAddEventButton();
    this._renderSortComponent();

    this._api.getPoints().then((points) => {
      if (points.length === 0) {
        this._showMessage(Message.NO_POINTS);
      }
      this._pointsModel.setPoints(points);
    });
  }

  show() {
    this._container.classList.remove(HIDE_CLASS);
  }

  hide() {
    this._container.classList.add(HIDE_CLASS);
  }

  _getData(cb) {
    Promise.all([this._api.getDestinations(), this._api.getOffers()])
      .then((data) => {
        const [destinations, offers] = data;
        this._destinations = destinations;
        this._offers = offers;
        cb();
      });
  }

  _isDataBeenSaved() {
    return this._destinations.length && this._offers.length;
  }

  _renderWithSortType() {
    if (this._tripDaysListComponent) {
      remove(this._tripDaysListComponent);
    }
    this._removeEscListenersIfExists();

    const isAnyPoints = this._pointsModel.getPointsAll().length;
    if (isAnyPoints) {
      this._noPointsComponent.hide();
      this._sortComponent.show();

      if (this._pointsModel.getPoints().length === 0) {
        return;
      }

      if (this._isDataBeenSaved()) {
        this._renderEventsList();
        return;
      }
      this._getData(this._renderEventsList);
    } else {
      this._showMessage(Message.NO_POINTS);
    }
  }

  _renderEventsList() {
    const days = this._pointsModel.getDays();

    this._tripDaysListComponent = new TripDaysListComponent(days, this._sortType);
    render(this._container, this._tripDaysListComponent.getElement());

    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = days.map((day, i) => {
      const container = this._tripDaysListComponent.getElement()
        .querySelectorAll(`.trip-days__item`)[i]
        .querySelector(`.trip-events__list`);
      return this._renderEvents(day, container);
    }).reduce((its, it) => its.concat(it), []);
  }

  _renderEvents(events, container) {
    return events.map((event) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(event, this._destinations, this._offers, Mode.VIEW);
      return pointController;
    });
  }

  _renderAddEventForm() {
    if (this._isDataBeenSaved()) {
      this._createAddEventForm();
      return;
    }
    this._getData(this._createAddEventForm);
  }

  _createAddEventForm() {
    this._onViewChange();
    this._noPointsComponent.hide();
    this._addEventButtonComponent.setDisabled(true);
    this._addEventFormController = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._addEventFormController.render({}, this._destinations, this._offers, Mode.ADD);
  }

  _renderAddEventButton() {
    const tripMainElement = document.querySelector(`.trip-main`);
    render(tripMainElement, this._addEventButtonComponent.getElement());
    this._addEventButtonComponent.setClickHandler(() => {
      this._noPointsComponent.hide();
      this._renderAddEventForm();
    });
  }

  _renderSortComponent() {
    render(this._container, this._sortComponent.getElement());
  }

  _renderNoPoints(message) {
    render(this._container, this._noPointsComponent.getElement());
    this._showMessage(message);
  }

  _showMessage(text) {
    this._sortComponent.hide();
    this._noPointsComponent.setMessage(text);
    this._noPointsComponent.show();
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
    const index = this._pointControllers.findIndex((pointController) => pointController._mode === Mode.EDIT);
    if (index !== -1) {
      this._pointControllers[index].removeEscListener();
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
      })
      .catch(() => {
        pointController.shake();
      });
      return;
    }

    if (oldEvent === null) {
      this._api.createPoint(newEvent).then((point) => {
        this._onViewChange();
        this._pointsModel.addPoint(point);
      })
      .catch(() => {
        pointController.shake();
      });
      return;
    }
    if (newEvent && oldEvent) {
      this._api.updatePoint(oldEvent.id, newEvent).then((point) => {
        this._pointsModel.updatePoint(point.id, point);
        this._onViewChange();
      })
      .catch(() => {
        pointController.shake();
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
    if (this._addEventFormController) {
      this._addEventButtonComponent.setDisabled(false);
      this._addEventFormController.destroy();
      if (this._pointsModel.getPointsAll().length === 0) {
        this._showMessage(Message.NO_POINTS);
      }
    }
  }
}

export default TripController;
