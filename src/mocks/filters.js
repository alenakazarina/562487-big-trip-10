const FILTER_NAMES = [
  `EveryThing`,
  `Future`,
  `Past`
];

const generateFilters = () => FILTER_NAMES.map((name) => ({
  name: name.toLowerCase(),
  count: Math.floor(Math.random() * 10)
}));

export {generateFilters};
