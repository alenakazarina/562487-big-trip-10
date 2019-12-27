import {parseDateFromISOString} from '../utils/common';

class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = parseDateFromISOString(data[`date_from`]);
    this.endDate = parseDateFromISOString(data[`date_to`]);
    this.destination = data[`destination`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  toRAW() {
    return {
      'id': `${this.id}`,
      'type': this.type,
      'date_from': this.startDate,
      'date_to': this.endDate,
      'destination': this.destination,
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}

export default Point;
