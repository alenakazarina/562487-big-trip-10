const MAX_OFFERS_COUNT_TO_SHOW = 3;
const HIDE_CLASS = `visually-hidden`;
const ERROR_CLASS = `event--error`;

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
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  ICON_PATHS,
  MAX_OFFERS_COUNT_TO_SHOW,
  SortType,
  FilterType,
  Mode,
  Preposition,
  MenuTab
};

