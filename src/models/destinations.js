class Destinations {
  constructor() {
    this._destinations = [];
    this._defaultDestination = {
      name: ``,
      description: ``,
      pictures: []
    };
  }

  setDestinations(items) {
    this._destinations = items.map((it) => Object.assign({}, it));
  }

  getAll() {
    return this._destinations;
  }

  getDestinationByName(name) {
    if (name === ``) {
      return this._defaultDestination;
    }
    return this._destinations.find((it) => it.name === name);
  }
}

export default Destinations;
