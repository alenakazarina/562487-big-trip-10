class Offers {
  constructor() {
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.map((it) => {
      return {
        type: it.type,
        offers: it.offers
      };
    });
  }

  getOffersByType(type) {
    return this._offers.find((it) => it.type === type).offers;
  }
}

export default Offers;
