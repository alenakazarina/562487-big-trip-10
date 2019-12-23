import AbstractComponent from './abstract-component';
import {FilterType} from '../const';

const createFilter = (filter, isActive) => {
  const isChecked = isActive ? `checked` : ``;

  return `
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>
  `;
};

const createFiltersTemplate = (activeFilter) => {
  const filtersTemplate = Object.values(FilterType)
  .map((it) => createFilter(it, it === activeFilter)).join(`\n`);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

class Filters extends AbstractComponent {
  constructor(activeFilter) {
    super();
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createFiltersTemplate(this._activeFilter);
  }

  setFiltersChangeHandler(handler) {
    document.querySelector(`.trip-filters`).addEventListener(`change`, (evt) => {
      handler(evt.target.value);
    });
  }
}

export default Filters;
