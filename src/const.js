const ERROR_CLASS = `event--error`;

const TRANSFER_EVENTS = {
  TAXI: {
    kind: `transfer`,
    type: `taxi`,
    emoji: `🚕`,
    chartLabel: `🚕 TAXI`,
    preposition: `to`,
    icon: `taxi.png`
  },
  BUS: {
    kind: `transfer`,
    type: `bus`,
    emoji: `🚌`,
    chartLabel: `🚌 BUS`,
    preposition: `to`,
    icon: `bus.png`
  },
  TRAIN: {
    kind: `transfer`,
    type: `train`,
    emoji: `🚂`,
    chartLabel: `🚂 TRAIN`,
    preposition: `to`,
    icon: `train.png`
  },
  SHIP: {
    kind: `transfer`,
    type: `ship`,
    emoji: `🚢`,
    chartLabel: `🚢 SHIP`,
    preposition: `to`,
    icon: `ship.png`
  },
  TRANSPORT: {
    kind: `transfer`,
    type: `transport`,
    emoji: `🚊`,
    chartLabel: `🚊 TRANSPORT`,
    preposition: `to`,
    icon: `transport.png`
  },
  DRIVE: {
    kind: `transfer`,
    type: `drive`,
    emoji: `🚗`,
    chartLabel: `🚗 DRIVE`,
    preposition: `to`,
    icon: `drive.png`
  },
  FLIGHT: {
    kind: `transfer`,
    type: `flight`,
    emoji: `✈️`,
    chartLabel: `✈️ FLIGHT`,
    preposition: `to`,
    icon: `flight.png`
  }
};

const ACTIVITY_EVENTS = {
  CHECK_IN: {
    kind: `activity`,
    type: `check-in`,
    emoji: `🏨`,
    chartLabel: `🏨 CHECK-IN`,
    preposition: `at`,
    icon: `check-in.png`
  },
  SIGHTSEEING: {
    kind: `activity`,
    type: `sightseeing`,
    emoji: `🏛`,
    chartLabel: `🏛 SIGHTSEEING`,
    preposition: `at`,
    icon: `sightseeing.png`
  },
  RESTAURANT: {
    kind: `activity`,
    type: `restaurant`,
    emoji: `🍴`,
    chartLabel: `🍴 RESTAURANT`,
    preposition: `at`,
    icon: `restaurant.png`
  }
};

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

const MenuTab = {
  TABLE: `Table`,
  STATS: `Stats`
};

const availableEvents = [].concat(Object.values(TRANSFER_EVENTS), Object.values(ACTIVITY_EVENTS));

export {
  ERROR_CLASS,
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  availableEvents,
  SortType,
  FilterType,
  Mode,
  MenuTab
};

