import AbstractComponent from './abstract-component';

const createFilter = (filter) => {
  const isChecked = filter.name === `EveryThing` ? `checked` : ``;

  return `
    <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>
  `;
};

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((it) => createFilter(it)).join(`\n`);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}

export default Filters;
