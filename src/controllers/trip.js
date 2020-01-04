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

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.addFilterChangeHandler(this._renderWithSortType);
    this._pointsModel.addDataChangeHandler(this._renderWithSortType);
  }

  render() {
    this._api.getPoints().then((points) => {
      this._pointsModel.setPoints(points);
      this._renderAddEventButton();
      this._renderNoPoints(Message.LOADING);
      this._renderPoints();
    });
  }

  show() {
    this._container.classList.remove(HIDE_CLASS);
  }

  hide() {
    this._container.classList.add(HIDE_CLASS);
  }

  _renderPoints() {
    Promise.all([this._api.getDestinations(), this._api.getOffers()])
      .then((data) => {
        const [destinations, offers] = data;
        this._destinations = destinations;
        this._offers = offers;

        this._renderEventsList();
      });
  }

  _renderEvents(events, container) {
    return events.map((event) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(event.id, event, this._destinations, this._offers, Mode.VIEW);
      return pointController;
    });
  }

  _renderEventsList() {
    const days = this._pointsModel.getDays();

    if (days.length === 0) {
      this._noPointsComponent.setMessage(Message.NO_POINTS);
      this._noPointsComponent.show();
      return;
    }

    this._noPointsComponent.hide();
    this._renderSort();

    this._tripDaysListComponent = new TripDaysListComponent(days, this._sortType);
    render(this._container, this._tripDaysListComponent.getElement());

    this._pointControllers = days.map((day, i) => {
      const container = this._tripDaysListComponent.getElement().querySelectorAll(`.trip-days__item`)[i].querySelector(`.trip-events__list`);
      return this._renderEvents(day, container);
    }).reduce((its, it) => its.concat(it), []);
  }

  _renderWithSortType() {
    remove(this._tripDaysListComponent);
    this._removeEscListenersIfExists();

    const isAnyPoints = this._pointsModel.getPointsAll().length;
    if (isAnyPoints) {
      if (this._pointsModel.getPoints().length === 0) {
        return;
      }

      this._noPointsComponent.hide();
      this._sortComponent.show();
      this._renderEventsList();
    } else {
      this._showMessage(Message.NO_POINTS);
    }
  }

  _renderAddEventForm() {
    const isDestinations = this._destinations.length === 0;
    const isOffers = this._offers.length === 0;

    if (isDestinations && isOffers) {
      this._createAddEventForm();
      return;
    }

    Promise.all([this._api.getDestinations(), this._api.getOffers()]).then((data) => {
      const [destinations, offers] = data;
      this._destinations = destinations;
      this._offers = offers;
      this._createAddEventForm();
    });
  }

  _createAddEventForm() {
    this._onViewChange();
    this._pointControllers.forEach((it) => it.setOpenButton(true));
    this._noPointsComponent.hide();

    this._addEventButtonComponent.setDisabled(true);
    this._newEventId = Date.now();
    this._addEventFormController = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._addEventFormController.render(this._newEventId, {}, this._destinations, this._offers, Mode.ADD);
  }

  _renderNoPoints(message) {
    render(this._container, this._noPointsComponent.getElement());
    this._noPointsComponent.setMessage(message);
    this._noPointsComponent.show();
  }

  _renderSort() {
    render(this._container, this._sortComponent.getElement());
    this._sortComponent.getElement().children[0].innerHTML = this._sortType === SortType.EVENT ? `Day` : ``;
  }

  _renderAddEventButton() {
    const tripMainElement = document.querySelector(`.trip-main`);
    render(tripMainElement, this._addEventButtonComponent.getElement());
    this._addEventButtonComponent.setClickHandler(() => {
      this._noPointsComponent.hide();
      this._renderAddEventForm();
    });
  }

  _showMessage(text) {
    this._sortComponent.hide();
    this._noPointsComponent.setMessage(text);
    this._noPointsComponent.show();
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
      document.removeEventListener(`keydown`, this._pointControllers.find((it) => it._mode === Mode.EDIT)._onEscKeyPress);
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
        this._pointsModel.addPoint(point);
        this._onViewChange();
      })
      .catch(() => {
        pointController.shake();
      });
      return;
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
      document.removeEventListener(`keydown`, this._addEventFormController._onEscKeyPress);
      this._addEventFormController.destroy();
      this._pointControllers.forEach((it) => it.setOpenButton(false));
      if (this._pointsModel.getPointsAll().length === 0) {
        this._showMessage(Message.NO_POINTS);
      }
    }
  }
}

export default TripController;
