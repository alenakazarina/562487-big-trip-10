import AbstractComponent from './abstract-component';

const createFilter = (filter) => {
  const {name, isEmpty, checked} = filter;
  const isChecked = checked ? `checked` : ``;
  const isDisabled = isEmpty ? `disabled` : ``;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked} ${isDisabled}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
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

  setFiltersChangeHandler(handler) {
    document.querySelector(`.trip-filters`).addEventListener(`change`, (evt) => {
      handler(evt.target.value);
    });
  }
}

export default Filters;
