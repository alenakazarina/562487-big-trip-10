import {FilterType, SortType} from '../const';
import {isSameDay, getUniqueDays, getDatesDiff, calculateSum} from '../utils/common';

const getSortedPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      return points.slice().sort((firstPoint, secondPoint) => getDatesDiff(firstPoint.startDate, secondPoint.startDate));
    case SortType.TIME:
      return points.slice().sort((firstPoint, secondPoint) => getDatesDiff(secondPoint.endDate, secondPoint.startDate) - getDatesDiff(firstPoint.endDate, firstPoint.startDate));
    case SortType.PRICE:
      return points.slice().sort((firstPoint, secondPoint) => secondPoint.price - firstPoint.price);
    default:
      throw Error(`Unknown sortType: ${sortType}`);
  }
};

const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.slice();
    case FilterType.FUTURE:
      return points.filter((point) => getDatesDiff(point.startDate, Date.now()) > 0);
    case FilterType.PAST:
      return points.filter((point) => getDatesDiff(point.startDate, Date.now()) < 0);
    default:
      throw Error(`Unknown filterType: ${filterType}`);
  }
};

const calculateCosts = (points) => {
  const pointsPricesAmount = calculateSum(points.map((point) => +point.price));
  const offersPrices = points.map((point) => point.offers.map((offer) => +offer.price));
  const offersPricesAmount = calculateSum(offersPrices.map((arr) => calculateSum(arr)));
  return pointsPricesAmount + offersPricesAmount;
};

class Points {
  constructor(activeFilterType, activeSortType) {
    this._points = [];
    this._pointsDates = [];
    this._activeFilterType = activeFilterType;
    this._activeSortType = activeSortType;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._sortTypeChangeHandlers = [];
  }

  getPointsAll() {
    return this._points;
  }

  getPoints() {
    return getSortedPoints(getPointsByFilter(this._points, this._activeFilterType), this._activeSortType);
  }

  getDays() {
    if (!this._points.length) {
      return [];
    }
    const points = this.getPoints();
    const pointsDates = this._getPointsDates();
    return this._activeSortType === SortType.EVENT ?
      pointsDates
        .map((pointsDate) => points.filter((point) => isSameDay(point.startDate, pointsDate)))
        .filter((datePoints) => datePoints.length) :
      [points];
  }

  getCostsAmount() {
    if (this._points.length === 0) {
      return 0;
    }
    return calculateCosts(this._points);
  }

  getPointsByFilter(filterType) {
    return getPointsByFilter(this._points, filterType);
  }

  setPoints(points) {
    if (points.length === 0) {
      this._points = [];
      return;
    }
    this._points = points
      .map((point) => Object.assign({}, point, {startDate: point.startDate}, {endDate: point.endDate}))
      .sort((firstPoint, secondPoint) => getDatesDiff(firstPoint.startDate, secondPoint.startDate));

    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSort(sortType) {
    this._activeSortType = sortType;
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    const index = this._getPointById(id);
    if (index === -1) {
      throw Error(`no point with id ${id} in points array`);
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
  }

  updatePoint(id, newPoint, isFavorite) {
    const index = this._getPointById(id);
    if (index === -1) {
      throw Error(`no point with id ${id} in points array`);
    }

    this._points[index] = Object.assign({}, newPoint);
    if (isFavorite === false) {
      this._callHandlers(this._dataChangeHandlers);
    }
  }

  addDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _getPointsDates() {
    const startDates = this._points.map((point) => point.startDate).sort((firstDate, secondDate) => getDatesDiff(firstDate, secondDate));
    return getUniqueDays(startDates);
  }

  _getPointById(id) {
    return this._points.findIndex((point) => point.id === id);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Points;
