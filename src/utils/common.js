import {DEFAULT_DESCRIPTION, ICON_PATHS, OFFERS, ACTIVITY_EVENTS} from '../const';

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
  const length = getRandomIntegerNumber(0, maxLength + 1);
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

const generateOffers = (count) => {
  let randomOffers = getRandomArray(OFFERS, count);
  if (!randomOffers.length) {
    return randomOffers;
  }

  let offers = [];
  if (randomOffers.filter((it) => it.type === `luggage`).length) {
    offers.push(getRandomArrayItem(randomOffers.filter((it) => it.type === `luggage`)));
  }
  if (randomOffers.filter((it) => it.type === `meal`).length) {
    offers.push(getRandomArrayItem(randomOffers.filter((it) => it.type === `meal`)));
  }
  if (randomOffers.filter((it) => it.type === `comfort`).length) {
    offers.push(getRandomArrayItem(randomOffers.filter((it) => it.type === `comfort`)));
  }
  if (randomOffers.filter((it) => it.type === `seats`).length) {
    offers.push(getRandomArrayItem(randomOffers.filter((it) => it.type === `seats`)));
  }

  return offers;
};

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
  getEventType
};
