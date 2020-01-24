import Point from '../models/point';
import Destination from '../models/destination';
import Offer from '../models/offer';

const getSyncedItems = (items) => items.filter(({success}) => success).map(({payload}) => {
  payload.point.offline = false;
  return payload.point;
});

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then((points) => {
        points.forEach((point) => this._store.setPoint(point.id, point.toRAW()));
        return points;
      });
    }
    this._isSynchronized = false;
    const storePoints = Object.values(this._store.getPoints());
    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point).then((newPoint) => {
        this._store.setPoint(newPoint.id, newPoint.toRAW());
        return newPoint;
      });
    }
    this._isSynchronized = false;
    this._store.setPoint(point.id, Object.assign({}, point.toRAW(), {offline: true}));
    return Promise.resolve(point);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point).then((newPoint) => {
        this._store.setPoint(newPoint.id, newPoint.toRAW());
        return newPoint;
      });
    }
    this._isSynchronized = false;
    this._store.setPoint(point.id, Object.assign({}, point.toRAW(), {offline: true}));
    return Promise.resolve(point);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id).then((response) => {
        if (response.ok) {
          this._store.removePoint(id);
        }
        return response;
      });
    }

    this._isSynchronized = false;
    this._store.removePoint(id);
    return Promise.resolve();
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations().then((destinations) => {
        destinations.forEach((destination, index) => this._store.setDestination(index, destination.toRAW()));
        return destinations;
      });
    }
    this._isSynchronized = false;
    const storeDestinations = Object.values(this._store.getDestinations());
    return Promise.resolve(Destination.parseDestinations(storeDestinations));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers().then((offers) => {
        offers.forEach((offer, index) => this._store.setOffer(index, offer.toRAW()));
        return offers;
      });
    }
    this._isSynchronized = false;
    const storeOffers = Object.values(this._store.getOffers());
    return Promise.resolve(Offer.parseOffers(storeOffers));
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          storePoints.filter((point) => point.offline).forEach((point) => {
            this._store.removePoint(point.id);
          });

          const createdPoints = response.created.map((point) => {
            point.offline = false;
            return point;
          });

          const updatedPoints = getSyncedItems(response.updated);
          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._store.setPoint(point.id, point);
          });

          const points = Object.values(this._store.getPoints());
          this._isSynchronized = true;
          return Promise.resolve(Point.parsePoints(points));
        });
    }

    return Promise.reject(new Error(`Sync data failed!`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}

export default Provider;
