import {FilterType, SortType} from '../const';
import {getUniqueDays, getDatesDiff, calculateSum} from '../utils/common';

const getSortedPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      return points.slice().sort((a, b) => getDatesDiff(a.startDate, b.startDate));
    case SortType.TIME:
      return points.slice().sort((a, b) => getDatesDiff(b.endDate, b.startDate) - getDatesDiff(a.endDate, a.startDate));
    case SortType.PRICE:
      return points.slice().sort((a, b) => b.price - a.price);
  }
  return points;
};

const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.slice();
    case FilterType.FUTURE:
      return points.filter((point) => getDatesDiff(point.startDate, Date.now()) > 0);
    case FilterType.PAST:
      return points.filter((point) => getDatesDiff(point.startDate, Date.now()) < 0);
  }
  return points;
};

const calculateCosts = (events) => {
  if (events.length === 0) {
    return 0;
  }
  const eventsPricesAmount = calculateSum(events.map((it) => +it.price));
  const offers = events.map((event) => event.offers.map((offer) => +offer.price));
  const offersAmount = calculateSum(offers.map((arr) => calculateSum(arr)));
  return eventsPricesAmount + offersAmount;
};

class Points {
  constructor() {
    this._points = [];
    this._pointsDates = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.EVENT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._sortTypeChangeHandlers = [];
  }

  getPoints() {
    return getSortedPoints(getPointsByFilter(this._points, this._activeFilterType), this._activeSortType);
  }

  getPointsDates(points) {
    const pointsDates = this._getPointsDates(points);
    return pointsDates;
  }

  getCostsAmount() {
    return calculateCosts(this._points);
  }

  setPoints(points) {
    if (points.length === 0) {
      this._points = [];
      this._pointsDates = [];
      return;
    }
    this._points = points
      .map((point) => Object.assign({}, point, {startDate: point.startDate}, {endDate: point.endDate}))
      .sort((a, b) => getDatesDiff(a.startDate, b.startDate) > 0);

    this._pointsDates = this._getPointsDates(this._points);
    //  updated trip-info
    this._callHandlers([this._dataChangeHandlers[0]]);
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._pointsDates = this._getPointsDates(this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    const index = this._getPointById(id);
    if (index === -1) {
      throw Error(`no point with id ${id} in points array`);
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._pointsDates = this._getPointsDates(this._points);
    this._callHandlers([this._dataChangeHandlers[0]]);
    return true;
  }

  updatePoint(id, newPoint) {
    const index = this._getPointById(id);
    if (index === -1) {
      throw Error(`no point with id ${id} in points array`);
    }
    this._points[index] = Object.assign({}, newPoint);
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSort(sortType) {
    if (Object.values(SortType).some((it) => it === sortType)) {
      this._activeSortType = sortType;
    }
  }

  addDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  addSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getPointById(id) {
    return this._points.findIndex((it) => it.id === id);
  }

  _getPointsDates(points) {
    const startDates = points.map((point) => point.startDate).sort((a, b) => getDatesDiff(a, b));
    return getUniqueDays(startDates);
  }
}

export default Points;
