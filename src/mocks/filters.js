const everythingFilter = {
  name: `Everything`,
  filterFn(days) {
    return days;
  }
};

const futureFilter = {
  name: `Future`,
  filterFn(days) {
    return days.filter((day) => day > Date.now());
  }
};

const pastFilter = {
  name: `Past`,
  filterFn(days) {
    return days.filter((day) => day < Date.now());
  }
};

const FILTERS = [
  everythingFilter,
  futureFilter,
  pastFilter
];

const generateFilters = (dates) => FILTERS.map((filter) => ({
  name: filter.name,
  days: filter.filterFn(dates)
}));

export {generateFilters};
