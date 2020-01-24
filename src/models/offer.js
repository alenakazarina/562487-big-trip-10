class Offer {
  constructor(offer) {
    this.type = offer[`type`];
    this.offers = offer[`offers`];
  }

  toRAW() {
    return {
      'type': this.type,
      'offers': this.offers
    };
  }

  static parseOffer(offer) {
    return new Offer(offer);
  }

  static parseOffers(offers) {
    return offers.map(Offer.parseOffer);
  }
}

export default Offer;
