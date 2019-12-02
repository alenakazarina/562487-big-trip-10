import {generateEvent} from './event';

const generateEvents = (count = 1, dates) => {
  return new Array(count)
    .fill(``)
    .map(() => generateEvent(dates));
};

export {generateEvents};

