import {DEFAULT_DESCRIPTION, ICON_PATHS, ACTIVITY_EVENTS, OFFER_TYPES, PHOTO_PATH} from '../const';
import moment from 'moment';

const isSameDay = (a, b) => {
  return moment(a).isSame(b, `day`) && moment(a).isSame(b, `month`) && moment(a).isSame(b, `year`);
};

const isSameMonth = (a, b) => {
  return moment(a).isSame(b, `month`) && moment(a).isSame(b, `year`);
};

const getUniqueDays = (days) => {
  let uniqueDays = [];
  days.forEach((day, i) => {
    if (i === 0 || uniqueDays.every((it) => isSameDay(it, day) === false)) {
      uniqueDays.push(day);
    }
  });
  return uniqueDays;
};

const getDatesDiff = (a, b) => {
  return moment(a) - moment(b);
};

const formatMonthDay = (date) => {
  return moment(date).format(`MMM DD`);
};

const formatTimeWithSlashes = (date) => {
  return `${moment(date).format(`DD/MM/YY hh:mm`)}`;
};

const parseDateFromISOString = (date) => {
  return moment(date).format();
};

const parseDateWithSlashes = (dateString) => {
  const [date, time] = dateString.split(` `);
  const [day, month, year] = date.split(`/`);
  return new Date(moment(`${day}-${month}-${year} ${time}`, `DD-MM-YY hh:mm`).format()).toISOString();
};

const formatDatetime = (date) => {
  return `${moment(date).format(`YYYY-MM-DD`)}`;
};

const formatFullDatetime = (date) => {
  return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL);
};

const getDuration = (startDate, endDate) => {
  const duration = moment.duration(moment(endDate).diff(moment(startDate)));

  const durationDays = duration.get(`days`) ? `${duration.get(`days`)}D` : ``;
  const durationHours = (durationDays || duration.get(`hours`)) ? `${duration.get(`hours`)}H` : ``;
  const durationMinutes = (durationHours || duration.get(`minutes`)) ? `${duration.get(`minutes`)}M` : ``;

  return {
    days: durationDays,
    hours: durationHours,
    minutes: durationMinutes
  };
};

const getDatetime = (date) => {
  return {
    datetime: formatFullDatetime(date),
    time: moment(date).format(`hh:mm`)
  };
};

const getWeekDay = (date) => {
  return moment(date).format(`ddd DD`);
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

const generateEventPhotos = (count) => new Array(count).fill(``)
  .map(() => Math.round(Math.random() * 1000))
  .map((number) => PHOTO_PATH.concat(number));

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
  isSameDay,
  isSameMonth,
  getUniqueDays,
  getDatesDiff,
  formatMonthDay,
  formatTimeWithSlashes,
  parseDateFromISOString,
  parseDateWithSlashes,
  formatDatetime,
  formatFullDatetime,
  getDuration,
  getDatetime,
  getWeekDay,
  getRandomArrayItem,
  getRandomIntegerNumber,
  getRandomArray,
  generateDescription,
  getIcon,
  capitalizeFirstLetter,
  generateEventPhotos,
  generateOffers,
  getEventType,
  getOfferType,
  getOfferObjects,
  isSameOffers,
  AVAILABLE_OFFERS
};
