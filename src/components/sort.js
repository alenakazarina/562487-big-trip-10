import AbstractSmartComponent from './abstract-smart-component';
import {SortType} from '../const';

const createDirectionIcon = () => {
  return `
    <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>
  `;
};

const createSortFitlerTemplate = (sortType, isChecked) => {
  const directionIcon = (sortType === SortType.TIME || sortType === SortType.PRICE) ? createDirectionIcon() : ``;

  return `
    <div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn trip-sort__btn--by-decrease" for="sort-${sortType}">${sortType} ${directionIcon}</label>
    </div>
  `;
};

const createSortTemplate = (activeSortType) => {
  const isDayShowed = activeSortType === SortType.EVENT ? `Day` : ``;
  const sortFitlersTemplate = Object.values(SortType).map((sortType) => createSortFitlerTemplate(sortType, sortType === activeSortType)).join(`\n`);

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${isDayShowed}</span>
      ${sortFitlersTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `;
};

class Sort extends AbstractSmartComponent {
  constructor(activeSortType) {
    super();
    this._activeSortType = activeSortType;
    this._sortClickHandler = null;
  }

  getTemplate() {
    return createSortTemplate(this._activeSortType);
  }

  recoveryListeners() {
    this.setSortClickHandler(this._sortClickHandler);
  }

  setSortClickHandler(handler) {
    this._sortClickHandler = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      const {sortType} = evt.target.dataset;

      if (sortType && sortType !== this._activeSortType) {
        this._activeSortType = sortType;
        this._sortClickHandler(sortType);
        this.rerender();
      }
    });
  }
}

export default Sort;
