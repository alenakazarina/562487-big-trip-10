const generateDatesArray = (daysCount) => {
  return new Array(daysCount)
    .fill(``)
    .map(() => new Date())
    .map((date, i) => {
      date.setDate(date.getDate() + i);
      date.setHours(date.getHours() + i);
      return date;
    });
};

export {generateDatesArray};
