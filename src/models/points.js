import {FilterType, SortType} from '../const';

const getSortedPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      return points.slice().sort((a, b) => (a.startDate - b.startDate));
    case SortType.TIME:
      return points.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
    case SortType.PRICE:
      return points.slice().sort((a, b) => b.price - a.price);
  }
  return points;
};

const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return Array.from(points);
    case FilterType.FUTURE:
      return points.filter((point) => point.startDate > Date.now());
    case FilterType.PAST:
      return points.filter((point) => point.startDate < Date.now());
  }
  return points;
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

  setPoints(points) {
    this._points = points.map((point) => Object.assign({}, point, {isFavorite: false})).sort((a, b) => a.startDate - b.startDate);

    this._pointsDates = this._getPointsDates(this._points);
  }

  addPoint(point) {
    this._points = [].concat(point, this.points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    const index = this._getPointById(id);
    if (index === -1) {
      return false;
    }

    this.points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  updatePoint(id, newPoint) {
    const index = this._getPointById(id);
    if (index === -1) {
      return false;
    }

    this.points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
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

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandlers(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setSortTypeChangeHandlers(handler) {
    this._sortTypeChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getPointById(id) {
    return this._points.findIndex((it) => it.id === id);
  }

  _getPointsDates(points) {
    return points
    .map((point) => point.startDate)
    .filter((date, i, arr) => arr.slice(i + 1, arr.length).every((it) => it !== date))
    .sort((a, b) => a - b);
  }
}

export default Points;
