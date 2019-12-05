export const createTripInfoMainTemplate = (startDate, endDate, cities) => {

  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const startTime = `${startDate.toString().substring(3, 7)} ${startDate.getDate()}`;
  const endTime = isSameMonth ? `${endDate.getDate()}` : `${endDate.toString().substring(3, 7)} ${endDate.getDate()}`;

  const titles = Array.from(cities);
  const titlesTemplate = titles.length <= 2 ?
    titles.join(`&mdash`) :
    `${titles[0]} &mdash; ... &mdash; ${titles[titles.length - 1]}`;

  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${titlesTemplate}</h1>
      <p class="trip-info__dates">${startTime}&nbsp;&mdash;&nbsp;${endTime}</p>
    </div>
  `;
};