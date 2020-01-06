const debounce = (callback, interval) => {
  let timeout = null;
  return (...args) => {
    const next = () => callback(...args);
    clearTimeout(timeout);
    timeout = setTimeout(next, interval);
  };
};

export {debounce};
