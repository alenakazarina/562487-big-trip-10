const FILTER_NAMES = [
  `EveryThing`,
  `Future`,
  `Past`
];

const generateFilters = () => FILTER_NAMES.map((it) => ({
  name: it.toLowerCase(),
  count: Math.floor(Math.random() * 10)
}));

export {generateFilters};
