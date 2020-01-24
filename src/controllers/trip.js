import SortComponent from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import NoPointsComponent from '../components/no-points';
import AddEventButtonComponent from '../components/add-event-button';
import PointController from './point';
import {render, replace, changeView, RenderPositions} from '../utils/render';
import {SortType, Mode} from '../const';

const Classes = {
  HIDE: `trip-events--hidden`,
  SHOW: `slide--left`
};

const Message = {
  LOADING: `Loading...`,
  NO_POINTS: `Click New Event to create your first point`
};

const getDefaultEvent = () => {
  return {
    id: Date.now(),
    type: `sightseeing`,
    startDate: new Date(),
    endDate: new Date(),
    destination: {
      name: ``,
      description: ``,
      pictures: []
    },
    price: 0,
    offers: [],
    isFavorite: false
  };
};

const createDestinationsHash = (destinations) => {
  const destinationsHash = {};
  destinations.forEach((destination) => {
    destinationsHash[destination.name] = Object.assign({}, {description: destination.description}, {pictures: destination.pictures});
  });
  return destinationsHash;
};

const createTypeToOffersMap = (offers) => {
  const typeToOffersMap = new Map();
  offers.forEach((offer) => {
    typeToOffersMap.set(offer.type, offer.offers);
  });
  return typeToOffersMap;
};

class TripController {
  constructor(container, pointsModel, api, sortType) {
    this._pointsModel = pointsModel;
    this._destinations = null;
    this._offers = null;
    this._api = api;
    this._pointControllers = [];
    this._sortType = sortType;
    this._container = container;
    this._sortComponent = new SortComponent(this._sortType);
    this._tripDaysListComponent = null;
    this._noPointsComponent = new NoPointsComponent();
    this._addEventButtonComponent = new AddEventButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._renderWithSortType = this._renderWithSortType.bind(this);
    this._renderEventsList = this._renderEventsList.bind(this);
    this._createAddEventForm = this._createAddEventForm.bind(this);

    this._sortComponent.setSortClickHandler(this._onSortTypeChange);
    this._pointsModel.addFilterChangeHandler(this._renderWithSortType);
    this._pointsModel.addDataChangeHandler(this._renderWithSortType);
  }

  render() {
    this._renderNoPoints(Message.LOADING);
    this._renderAddEventButton();

    this._api.getPoints().then((points) => {
      if (points.length === 0) {
        this._showMessage(Message.NO_POINTS);
      }
      this._renderSortComponent();
      this._pointsModel.setPoints(points);
    });
  }

  show() {
    this._container.classList.remove(Classes.HIDE);
    this._container.classList.add(Classes.SHOW);
  }

  hide() {
    this._container.classList.add(Classes.HIDE);
  }

  setNoPoints(isShowing) {
    const isNoPoints = this._pointsModel.getPointsAll().length === 0;
    if (isNoPoints && isShowing) {
      this._noPointsComponent.show();
      return;
    }
    this._noPointsComponent.hide();
  }

  _getData(cb) {
    Promise.all([this._api.getDestinations(), this._api.getOffers()])
      .then(([destinations, offers]) => {
        this._destinations = createDestinationsHash(destinations);
        this._offers = createTypeToOffersMap(offers);
        cb();
      });
  }

  _isDataBeenSaved() {
    return this._destinations && this._offers;
  }

  _renderWithSortType() {
    this._removeEscListenersIfExists();
    const isAnyPoints = this._pointsModel.getPointsAll().length;

    if (isAnyPoints) {
      changeView(this._sortComponent, this._noPointsComponent);

      if (this._pointsModel.getPoints().length === 0) {
        return;
      }

      if (this._isDataBeenSaved()) {
        this._renderEventsList();
        return;
      }
      this._getData(this._renderEventsList);
    } else {
      this._renderTripDaysList([]);
      this._showMessage(Message.NO_POINTS);
    }
  }

  _renderEventsList() {
    const days = this._pointsModel.getDays();
    this._renderTripDaysList(days);

    this._pointControllers.forEach((pointController) => pointController.destroy());

    this._pointControllers = days.map((day, i) => {
      const container = this._container.querySelector(`.day:nth-child(${i + 1}) .trip-events__list`);
      return this._renderEvents(day, container);
    }).reduce((pointControllers, pointController) => pointControllers.concat(pointController), []);
  }

  _renderTripDaysList(days) {
    const oldTripDaysListComponent = this._tripDaysListComponent;
    const newTripDaysListComponent = new TripDaysListComponent(days, this._sortType);
    this._tripDaysListComponent = newTripDaysListComponent;
    if (oldTripDaysListComponent) {
      replace(newTripDaysListComponent, oldTripDaysListComponent);
    } else {
      render(this._container, this._tripDaysListComponent.getElement());
    }
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
    const event = getDefaultEvent();
    this._onViewChange();
    this._noPointsComponent.hide();
    this._addEventButtonComponent.setDisabled(true);
    this._addEventFormController = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._addEventFormController.render(event, this._destinations, this._offers, Mode.ADD);
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
    render(this._container, this._sortComponent.getElement(), RenderPositions.AFTERFIRSTCHILD);
  }

  _renderNoPoints(message) {
    this._noPointsComponent.setMessage(message);
    render(document.querySelector(`.page-main`).firstElementChild, this._noPointsComponent.getElement(), RenderPositions.AFTERBEGIN);
  }

  _showMessage(text) {
    this._noPointsComponent.setMessage(text);
    changeView(this._noPointsComponent, this._sortComponent);
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

  _onDataChange(pointController, oldEvent, newEvent, isFavorite = false) {
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
        this._pointsModel.updatePoint(point.id, point, isFavorite);
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
