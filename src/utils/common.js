import {ICON_PATHS, ACTIVITY_EVENTS} from '../const';
import moment from 'moment';

const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

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

const capitalizeFirstLetter = (str) => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

const hasSameTitle = (array, it) => array.some((arrayIt) => array.length ? arrayIt.title === it.title : false);

export {
  calculateSum,
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
  getIcon,
  capitalizeFirstLetter,
  getEventType,
  hasSameTitle
};
