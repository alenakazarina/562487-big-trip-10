const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTimeWithSlashes = (date) => {
  // 18/03/19 12:25
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = date.getFullYear() % 2000;
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatDatetime = (date) => {
  // 2019-10-19
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth() + 1);
  const day = castTimeFormat(date.getDate());
  return `${year}-${month}-${day}`;
};

const formatFullDatetime = (date) => {
  // 2019-10-19T22:30
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return formatDatetime(date).concat(`T${hours}:${minutes}`);
};

export {
  castTimeFormat,
  formatTimeWithSlashes,
  formatDatetime,
  formatFullDatetime
};
