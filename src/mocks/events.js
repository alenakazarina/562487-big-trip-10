import {generateAvailableOffers} from '../utils';
import {
  PHOTO_PATH,
  DEFAULT_DESCRIPTION,
  DEFAULT_CITIES,
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  ICON_PATHS,
} from '../const';

const PHOTOS_COUNT = 5;

const MAX_OFFERS_COUNT = 3;

const getIcon = (eventType) => ICON_PATHS.filter((it) => it.startsWith(eventType.toLowerCase())).join();

const generateDefaultEvents = () => {
  let types = [];
  types = types
    .concat(ACTIVITY_EVENTS.map((event) => ({
      type: `activity`,
      name: event,
      icon: getIcon(event)
    })))
    .concat(TRANSFER_EVENTS.map((event) => ({
      type: `transfer`,
      name: event,
      icon: getIcon(event)
    })));
  return types;
};

const generateEventPhotos = (count) => new Array(count).fill(``)
  .map(() => Math.round(Math.random() * 1000))
  .map((number) => PHOTO_PATH.concat(number));

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

const defaultEvents = generateDefaultEvents();
const availableOffers = generateAvailableOffers();

const generateEvent = (dates, id) => {
  const event = getRandomArrayItem(defaultEvents);
  const eventDate = getRandomArrayItem(dates);
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + getRandomIntegerNumber(1, 5));
  endDate.setMinutes(endDate.getMinutes() + getRandomIntegerNumber(1, 100));

  event.id = id;
  event.startDate = eventDate;
  event.endDate = endDate;

  event.destination = getRandomArrayItem(DEFAULT_CITIES);

  event.price = getRandomIntegerNumber(1, 10000);

  event.description = generateDescription();

  event.photos = generateEventPhotos(PHOTOS_COUNT);

  event.offers = getRandomArray(availableOffers, MAX_OFFERS_COUNT);

  return event;
};

const generateEvents = (count, dates) => {
  return new Array(count)
    .fill(``)
    .map((it, id) => generateEvent(dates, id));
};

export {generateEvents};
