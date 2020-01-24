class Destination {
  constructor(destination) {
    this.name = destination[`name`];
    this.description = destination[`description`];
    this.pictures = destination[`pictures`];
  }

  toRAW() {
    return {
      'name': this.name,
      'description': this.description,
      'pictures': this.pictures
    };
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destinations) {
    return destinations.map(Destination.parseDestination);
  }
}

export default Destination;
