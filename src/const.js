const PHOTO_PATH = `https://picsum.photos/300/150?r=`;
const MAX_OFFERS_COUNT_TO_SHOW = 3;
const MAX_OFFERS_COUNT = 5;
const PHOTOS_COUNT = 5;
const HIDE_CLASS = `visually-hidden`;
const ERROR_CLASS = `event--error`;

const DEFAULT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DEFAULT_CITIES = [
  `Saint Petersburg`,
  `Amsterdam`,
  `Geneva`,
  `Chamonix`
];

const TRANSFER_EVENTS = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

const ACTIVITY_EVENTS = [
  `check-in`,
  `sightseeing`,
  `restaurant`
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

const OFFER_TYPES = [
  `meal`,
  `luggage`,
  `comfort`,
  `seats`
];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`
};

const Mode = {
  VIEW: `view`,
  EDIT: `edit`,
  ADD: `add`
};

const Preposition = {
  activity: `at`,
  transfer: `to`
};

const MenuTab = {
  TABLE: `Table`,
  STATS: `Stats`
};

export {
  HIDE_CLASS,
  ERROR_CLASS,
  PHOTO_PATH,
  PHOTOS_COUNT,
  DEFAULT_DESCRIPTION,
  DEFAULT_CITIES,
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  ICON_PATHS,
  OFFER_TYPES,
  MAX_OFFERS_COUNT,
  MAX_OFFERS_COUNT_TO_SHOW,
  SortType,
  FilterType,
  Mode,
  Preposition,
  MenuTab
};

