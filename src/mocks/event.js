import {EVENT_TYPES, ICON_PATHS, AVAILABLE_OFFERS} from '../const';

const PHOTOS_COUNT = 5;
const PHOTO_PATH = `http://picsum.photos/300/150?r=`;

const DEFAULT_CITIES = [
  `Saint Petersburg`,
  `Amsterdam`,
  `Geneva`,
  `Chamonix`
];

const DEFAULT_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getIcon = (type) => ICON_PATHS.filter((it) => it.startsWith(type.toLowerCase()));

const defaultEvents = EVENT_TYPES.map((eventType) => ({
  type: eventType.type,
  icon: getIcon(eventType.name),
  title: eventType.name
}));

const generateEventPhotos = (count) => {
  const randomArray = new Array(count).fill(``).map(() => Math.random() * 1000);
  return new Array(count).fill(``).map((it, i) => PHOTO_PATH.concat(randomArray[i]));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
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

const generateEvent = (dates) => {
  const event = getRandomArrayItem(defaultEvents);

  const eventDate = dates[getRandomIntegerNumber(0, dates.length)];
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + getRandomIntegerNumber(1, 5));
  endDate.setMinutes(endDate.getMinutes() + getRandomIntegerNumber(1, 30));

  event.startDate = eventDate;
  event.endDate = endDate;

  event.destination = getRandomArrayItem(DEFAULT_CITIES);

  event.price = getRandomIntegerNumber(1, 10000);

  event.description = generateDescription();

  event.photos = generateEventPhotos(PHOTOS_COUNT);

  event.offers = AVAILABLE_OFFERS;

  return event;
};

export {generateEvent};
