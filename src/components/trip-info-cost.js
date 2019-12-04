const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

const calculateCosts = (events) => {
  const eventsPricesAmount = calculateSum(events.map((it) => it.price));
  const offers = events.map((event) => event.offers.map((offer) => offer.price));
  const offersAmount = calculateSum(offers.map((arr) => calculateSum(arr)));
  return eventsPricesAmount + offersAmount;
};

const createTripInfoCostTemplate = (events) => {
  const value = calculateCosts(events);
  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${value}</span>
    </p>
  `;
};

export {createTripInfoCostTemplate};
