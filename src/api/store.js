class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  setPoint(id, value) {
    const store = this.getPoints();
    this._storage.setItem(
        this._key.POINTS,
        JSON.stringify(Object.assign({}, store, {[id]: value}))
    );
  }

  getPoints() {
    try {
      return JSON.parse(this._storage.getItem(this._key.POINTS));
    } catch (err) {
      return {};
    }
  }

  removePoint(key) {
    const store = this.getPoints();
    delete store[key];
    this._storage.setItem(
        this._key.POINTS,
        JSON.stringify(Object.assign({}, store))
    );
  }

  setDestination(id, value) {
    const store = this.getDestinations();
    this._storage.setItem(
        this._key.DESTINATIONS,
        JSON.stringify(Object.assign({}, store, {[id]: value}))
    );
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._key.DESTINATIONS));
    } catch (err) {
      return {};
    }
  }

  setOffer(id, value) {
    const store = this.getOffers();
    this._storage.setItem(
        this._key.OFFERS,
        JSON.stringify(Object.assign({}, store, {[id]: value}))
    );
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._key.OFFERS));
    } catch (err) {
      return {};
    }
  }
}

export default Store;
