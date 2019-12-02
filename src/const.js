const EVENT_TYPES = [
  {
    name: `Taxi`,
    type: `transfer`
  },
  {
    name: `Bus`,
    type: `transfer`
  },
  {
    name: `Train`,
    type: `transfer`
  },
  {
    name: `Ship`,
    type: `transfer`
  },
  {
    name: `Transport`,
    type: `transfer`
  },
  {
    name: `Drive`,
    type: `transfer`
  },
  {
    name: `Flight`,
    type: `transfer`
  },
  {
    name: `Check-in`,
    type: `activity`
  },
  {
    name: `Sightseeing`,
    type: `activity`
  },
  {
    name: `Restaurant`,
    type: `activity`
  }
];

const ICON_PATHS = [
  `bus.png`,
  `check-in.png`,
  `drive.png`,
  `flight.png`,
  `restaurant.png`,
  `ship.png`,
  `sightseeing.png`,
  `taxi.png`,
  `train.png`,
  `transport.png`
];

const DEFAULT_OFFERS = [
  {
    type: `luggage`,
    title: `Add luggage +10 €`,
  },
  {
    type: `comfort`,
    title: `Switch to comfort class +150 €`,
  },
  {
    type: `meal`,
    title: `Add meal +2 €`,
  },
  {
    type: `seats`,
    title: `Choose seats +9 €`
  }
];

const AVAILABLE_OFFERS = DEFAULT_OFFERS.map((offer) => {
  const title = offer.title;
  const price = title.split(`+`)[1];
  offer.price = parseInt(price.substring(0, price.length - 2), 10);
  offer.title = title.split(`+`)[0];
  return offer;
});

export {
  EVENT_TYPES,
  ICON_PATHS,
  AVAILABLE_OFFERS
};

