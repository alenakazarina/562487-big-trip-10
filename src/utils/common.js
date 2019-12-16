import {DEFAULT_DESCRIPTION, ICON_PATHS, ACTIVITY_EVENTS, OFFER_TYPES} from '../const';

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTimeWithSlashes = (date) => {
  // 18/03/19 12:25
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = date.getFullYear() % 2000;
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatDatetime = (date) => {
  // 2019-10-19
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth() + 1);
  const day = castTimeFormat(date.getDate());
  return `${year}-${month}-${day}`;
};

const formatFullDatetime = (date) => {
  // 2019-10-19T22:30
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return formatDatetime(date).concat(`T${hours}:${minutes}`);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArray = (items, maxLength) => {
  const length = getRandomIntegerNumber(0, maxLength);
  return new Array(length).fill(``).map(() => getRandomArrayItem(items));
};

const getIcon = (eventType) => ICON_PATHS.filter((it) => it.startsWith(eventType.toLowerCase())).join();

const getEventType = (event) => ACTIVITY_EVENTS.findIndex((it) => it.toLowerCase() === event) !== -1 ? `activity` : `transfer`;

const generateDescription = () => {
  const sentences = DEFAULT_DESCRIPTION.split(`.`).filter((it, i, arr) => (i !== arr.length - 1));
  let count = getRandomIntegerNumber(1, 3);
  let description = ``;
  while (count) {
    description = description.concat(getRandomArrayItem(sentences), `.`);
    count--;
  }
  return description;
};

const capitalizeFirstLetter = (str) => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

const generateOffers = (name, count) => {
  const eventName = name.split(`-`)[0].toUpperCase();
  const randomOffers = new Set(getRandomArray(AVAILABLE_OFFERS[eventName], count));

  return Array.from(randomOffers);
};

const getOfferType = (offer) => {
  return OFFER_TYPES.filter((offerType) => offer.toLowerCase().includes(offerType)).join();
};

const getOfferObjects = (offers) => offers.map((offer) => ({
  type: getOfferType(offer),
  title: offer.split(`+`)[0],
  price: +offer.split(`+`)[1].split(` `)[0]
}));

const AVAILABLE_OFFERS = {
  TAXI: getOfferObjects([
    `Add luggage +5 €`,
    `Switch to comfort class +50 €`
  ]),
  BUS: getOfferObjects([
    `Add luggage +10 €`,
    `Choose seats +10 €`
  ]),
  TRAIN: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`
  ]),
  SHIP: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`
  ]),
  TRANSPORT: getOfferObjects([
    `Add luggage +15 €`
  ]),
  DRIVE: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`
  ]),
  FLIGHT: getOfferObjects([
    `Add luggage +15 €`,
    `Switch to comfort class +100 €`,
    `Add meal +5 €`,
    `Choose seats +20 €`
  ]),
  CHECK: getOfferObjects([
    `Switch to comfort class +200 €`,
    `Add meal +5 €`
  ]),
  SIGHTSEEING: getOfferObjects([
    `Choose seats +20 €`
  ]),
  RESTAURANT: getOfferObjects([
    `Choose seats +30 €`
  ])
};

const isSameOffers = (a, b) => a.type === b.type && a.title === b.title && a.price === b.price;

export {
  castTimeFormat,
  formatTimeWithSlashes,
  formatDatetime,
  formatFullDatetime,
  getRandomArrayItem,
  getRandomIntegerNumber,
  getRandomArray,
  generateDescription,
  getIcon,
  capitalizeFirstLetter,
  generateOffers,
  getEventType,
  getOfferType,
  getOfferObjects,
  isSameOffers,
  AVAILABLE_OFFERS
};
