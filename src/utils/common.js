import moment from 'moment';
import {render} from './render';
import ModalComponent from '../components/modal';

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
  return days.reduce((uniqueDays, day, i) => {
    if (i === 0 || uniqueDays.every((uniqueDay) => isSameDay(uniqueDay, day) === false)) {
      uniqueDays = uniqueDays.concat(day);
    }
    return uniqueDays;
  }, []);
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
  const Duration = {
    DAYS: Math.floor(moment.duration(moment(endDate).diff(startDate)).asDays()),
    HOURS: moment.duration(moment(endDate).diff(startDate)).hours(),
    MINUTES: moment.duration(moment(endDate).diff(startDate)).minutes()
  };

  const getDaysFormat = (days) => {
    if (days === 0) {
      return ``;
    }
    return days < 10 ? `0${days}D` : `${days}D`;
  };

  const getHoursFormat = (days, hours) => {
    if (days === 0 && hours === 0) {
      return ``;
    }

    return hours < 10 ? `0${hours}H` : `${hours}H`;
  };

  const getMinutesFormat = (minutes) => {
    return minutes < 10 ? `0${minutes}M` : `${minutes}M`;
  };

  return {
    days: getDaysFormat(Duration.DAYS),
    hours: getHoursFormat(Duration.DAYS, Duration.HOURS),
    minutes: getMinutesFormat(Duration.MINUTES)
  };
};

const getDatetime = (date) => {
  return {
    datetime: date,
    time: moment(date).format(`HH:mm`)
  };
};

const capitalizeFirstLetter = (eventType) => {
  return `${eventType.slice(0, 1).toUpperCase()}${eventType.slice(1)}`;
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
  capitalizeFirstLetter,
  hasSameTitle,
  showModalOnError
};
