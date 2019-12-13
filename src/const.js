const PHOTO_PATH = `http://picsum.photos/300/150?r=`;
const MAX_OFFERS_COUNT_TO_SHOW = 3;
const MAX_OFFERS_COUNT = 5;

const DEFAULT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DEFAULT_CITIES = [
  `Saint Petersburg`,
  `Amsterdam`,
  `Geneva`,
  `Chamonix`
];

const TRANSFER_EVENTS = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];

const ACTIVITY_EVENTS = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
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

const getOfferType = (offer) => {
  return [
    `meal`,
    `luggage`,
    `comfort`,
    `seats`
  ].filter((offerType) => offer.toLowerCase().includes(offerType)).join();
};

const OFFERS = [
  `Add luggage +5 €`,
  `Add luggage +10 €`,
  `Add luggage +20 €`,
  `Switch to comfort class +100 €`,
  `Switch to comfort class +150 €`,
  `Switch to comfort class +200 €`,
  `Add meal +2 €`,
  `Add meal +5 €`,
  `Add meal +10 €`,
  `Choose seats +5 €`,
  `Choose seats +10 €`,
  `Choose seats +20 €`
].map((offer) => ({
  type: getOfferType(offer),
  title: offer.split(`+`)[0],
  price: +offer.split(`+`)[1].split(` `)[0]
}));

export {
  PHOTO_PATH,
  DEFAULT_DESCRIPTION,
  DEFAULT_CITIES,
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  ICON_PATHS,
  OFFERS,
  MAX_OFFERS_COUNT,
  MAX_OFFERS_COUNT_TO_SHOW
};

