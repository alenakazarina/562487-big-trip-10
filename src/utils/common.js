import {ICON_PATHS, ACTIVITY_EVENTS} from '../const';
import moment from 'moment';
import {render} from './render';
import ModalComponent from '../components/modal';

const MSEC_IN_DAY = 1000 * 3600 * 24;

const calculateSum = (prices) => prices.reduce((amount, price) => {
  return price + amount;
}, 0);

const isSameDay = (firstDate, secondDate) => {
  return moment(firstDate).isSame(secondDate, `day`) && moment(firstDate).isSame(secondDate, `month`) && moment(firstDate).isSame(secondDate, `year`);
};

const isSameMonth = (firstDate, secondDate) => {
  return moment(firstDate).isSame(secondDate, `month`) && moment(firstDate).isSame(secondDate, `year`);
};

const getUniqueDays = (days) => {
  const uniqueDays = [];
  days.forEach((day, i) => {
    if (i === 0 || uniqueDays.every((uniqueDay) => isSameDay(uniqueDay, day) === false)) {
      uniqueDays.push(day);
    }
  });
  return uniqueDays;
};

const getDatesDiff = (firstDate, secondDate) => {
  return moment(firstDate) - moment(secondDate);
};

const formatMonthDay = (date) => {
  return moment(date).format(`MMM DD`);
};

const parseDate = (date) => {
  return moment(date).format();
};

const formatDatetime = (date) => {
  return `${moment(date).format(`YYYY-MM-DD`)}`;
};

const getDuration = (startDate, endDate) => {
  const duration = moment.duration(moment(endDate).diff(moment(startDate)));
  const daysCount = Math.floor(duration._milliseconds / MSEC_IN_DAY);
  const durationDays = daysCount ? `${daysCount}D` : ``;
  const durationHours = (durationDays || duration.get(`hours`)) ? `${duration.get(`hours`)}H` : ``;
  const durationMinutes = (durationHours || duration.get(`minutes`)) ? `${duration.get(`minutes`)}M` : ``;

  if (!durationDays && !durationHours && !durationMinutes) {
    return `0M`;
  }

  return `${durationDays} ${durationHours} ${durationMinutes}`;
};

const getDatetime = (date) => {
  return {
    datetime: date,
    time: moment(date).format(`hh:mm`)
  };
};

const getWeekDay = (date) => {
  return moment(date).format(`ddd DD`);
};

const getIcon = (eventType) => ICON_PATHS.filter((iconPath) => iconPath.startsWith(eventType.toLowerCase())).join();

const getEventType = (event) => ACTIVITY_EVENTS.findIndex((it) => it.toLowerCase() === event) !== -1 ? `activity` : `transfer`;

const capitalizeFirstLetter = (str) => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

const hasSameTitle = (offers, availableOffer) => offers.some((offer) => offers.length ? offer.title === availableOffer.title : false);

const showModalOnError = (err) => {
  const modalComponent = new ModalComponent(err);
  render(document.body, modalComponent.getElement());
  modalComponent.show();
};

export {
  calculateSum,
  isSameDay,
  isSameMonth,
  getUniqueDays,
  getDatesDiff,
  formatMonthDay,
  parseDate,
  formatDatetime,
  getDuration,
  getDatetime,
  getWeekDay,
  getIcon,
  capitalizeFirstLetter,
  getEventType,
  hasSameTitle,
  showModalOnError
};
