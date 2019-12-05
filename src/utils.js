import {OFFERS} from './const';

const getOfferType = (offer) => {
  const offerTypes = [
    `meal`,
    `luggage`,
    `comfort`,
    `seats`
  ];
  return offerTypes.filter((offerType) => offer.toLowerCase().includes(offerType)).join();
};

const generateAvailableOffers = () => {
  let offers = [];
  offers = offers.concat(OFFERS.map((offer) => ({
    type: getOfferType(offer),
    title: offer.split(`+`)[0],
    price: +offer.split(`+`)[1].split(` `)[0]
  })));
  return offers;
};

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

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

export {formatTimeWithSlashes, formatDatetime, formatFullDatetime, generateAvailableOffers, render};
