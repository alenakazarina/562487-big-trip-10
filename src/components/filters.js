import {generateFilters} from '../mocks/filters';

const createFilter = (filter) => {
  const isChecked = filter.name === `everything` ? `checked` : ``;

  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>
  `);
};

const createFiltersTemplate = () => {
  const filters = generateFilters();
  const filtersTemplate = filters.map((it) => createFilter(it)).join(`\n`);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export {createFiltersTemplate};
