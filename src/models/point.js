class Point {
  constructor(data) {
    this._id = data.id;
    this._type = data.type;
    this._name = data.name;
    this._icon = data.icon;
    this._startDate = data.startDate.toISOString();
    this._endDate = data.endDate.toISOString();
    this._destination = data.destination;
    this._price = data.price;
    this._description = data.description;
    this._photos = data.photos;
    this._offers = data.offers;
  }

  toRaw() {
    return {
      id: this._id,
      type: this._type,
      name: this._name,
      icon: this._icon,
      startDate: this._startDate.toISOString(),
      endDate: this._endDate.toISOString(),
      destination: this._destination,
      price: this._price,
      description: this._description,
      photos: this._photos,
      offers: this._offers
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parseTask);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}

export default Point;
