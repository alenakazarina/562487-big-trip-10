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
    return JSON.parse(this._storage.getItem(this._key.POINTS));
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
    return JSON.parse(this._storage.getItem(this._key.DESTINATIONS));
  }

  setOffer(id, value) {
    const store = this.getOffers();
    this._storage.setItem(
        this._key.OFFERS,
        JSON.stringify(Object.assign({}, store, {[id]: value}))
    );
  }

  getOffers() {
    return JSON.parse(this._storage.getItem(this._key.OFFERS));
  }
}

export default Store;
