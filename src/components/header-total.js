import {calculateSum} from '../utils';

const calculateCosts = (items) => {
  const eventsPricesAmount = calculateSum(items.map((it) => it.price));
  const offers = items.map((it) => it.offers.map((offer) => offer.price));
  let offersAmount = 0;
  offers.forEach((it) => {
    offersAmount += calculateSum(it);
  });
  return eventsPricesAmount + offersAmount;
};

export {calculateCosts};
