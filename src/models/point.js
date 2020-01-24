import {parseDate} from '../utils/common';

class Point {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.startDate = parseDate(point[`date_from`]);
    this.endDate = parseDate(point[`date_to`]);
    this.destination = point[`destination`];
    this.price = point[`base_price`];
    this.offers = point[`offers`];
    this.isFavorite = point[`is_favorite`];
  }

  toRAW() {
    return {
      'id': `${this.id}`,
      'type': this.type,
      'date_from': new Date(this.startDate).toISOString(),
      'date_to': new Date(this.endDate).toISOString(),
      'destination': this.destination,
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite
    };
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }
}

export default Point;
