import {
  PHOTO_PATH,
  DEFAULT_DESCRIPTION,
  DEFAULT_CITIES,
  ACTIVITY_EVENTS,
  TRANSFER_EVENTS,
  ICON_PATHS,
  OFFERS
} from '../const';

const PHOTOS_COUNT = 5;

const MAX_OFFERS_COUNT = 3;

const getIcon = (eventType) => ICON_PATHS.filter((it) => it.startsWith(eventType.toLowerCase())).join();

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

const generateDatesArray = (daysCount) => {
  return new Array(daysCount)
    .fill(``)
    .map(() => new Date())
    .map((date, i) => {
      if (i % 2) {
        date.setDate(date.getDate() + i);
        date.setHours(date.getHours() + i);
      } else {
        date.setDate(date.getDate() - i);
        date.setHours(date.getHours() - i);
      }
      return date;
    });
};

const genetateEndDate = (date) => {
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + getRandomIntegerNumber(0, 3));
  endDate.setHours(endDate.getHours() + getRandomIntegerNumber(0, 2));
  endDate.setMinutes(endDate.getMinutes() + getRandomIntegerNumber(1, 40));
  return endDate;
};

const generateEventDates = (dates) => {
  const startDate = getRandomArrayItem(dates);

  return {
    eventStartDate: startDate,
    eventEndDate: genetateEndDate(startDate)
  };
};

const defaultEvents = [].concat(ACTIVITY_EVENTS
  .map((event) => ({
    eventType: `activity`,
    eventName: event,
    eventIcon: getIcon(event)
  })))
  .concat(TRANSFER_EVENTS.map((event) => ({
    eventType: `transfer`,
    eventName: event,
    eventIcon: getIcon(event)
  })));

const generateEvent = (eventID, dates) => {
  const {eventType, eventName, eventIcon} = getRandomArrayItem(defaultEvents);
  const {eventStartDate, eventEndDate} = generateEventDates(dates);

  return {
    id: eventID,
    type: eventType,
    name: eventName,
    icon: eventIcon,
    startDate: eventStartDate,
    endDate: eventEndDate,
    destination: getRandomArrayItem(DEFAULT_CITIES),
    price: getRandomIntegerNumber(1, 10000),
    description: generateDescription(),
    photos: generateEventPhotos(PHOTOS_COUNT),
    offers: getRandomArray(OFFERS, MAX_OFFERS_COUNT)
  };
};

const generateEvents = (eventsCount, daysCount) => {
  const dates = generateDatesArray(daysCount);

  return new Array(eventsCount)
    .fill(``)
    .map((it, id) => generateEvent(id, dates));
};

export {generateEvents};
