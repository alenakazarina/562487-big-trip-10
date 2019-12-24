import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TRANSFER_EVENTS, ACTIVITY_EVENTS, Preposition} from '../const';
import {getDatesDiff} from '../utils/common';

const EmojiValue = {
  TAXI: `🚕`,
  BUS: `🚌`,
  TRAIN: `🚂`,
  SHIP: `🚢`,
  TRANSPORT: `🚊`,
  DRIVE: `🚗`,
  FLIGHT: `✈️`,
  CHECK: `🏨`,
  SIGHTSEEING: `🏛`,
  RESTAURANT: `🍴`
};

const getNamesWithEmoji = (eventsNames) => {
  return eventsNames.map((it) => {
    const emoji = EmojiValue[it.split(`-`)[0].toUpperCase()];
    return `${emoji} ${it.toUpperCase()}`;
  });
};

const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

const convertMsToHours = (time) => Math.floor(time / (1000 * 3600));

const calculateEventCosts = (points) => {
  return points.map((point) => point.price + calculateSum(point.offers.map((offer) => offer.price)));
};

const renderMoneyChart = (moneyCtx, points) => {
  const costs = calculateEventCosts(points);
  const eventsNames = points.map((it) => {
    const emoji = EmojiValue[it.name.split(`-`)[0].toUpperCase()];
    return `${emoji} ${Preposition[it.type]} ${it.destination}`.toUpperCase();
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventsNames,
      datasets: [
        {
          data: costs,
          minBarLength: 40,
          backgroundColor: `white`
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          color: `black`,
          clamp: true,
          anchor: `end`,
          align: `left`,
          font: {
            size: 14
          },
          textAlign: `center`,
          padding: 2,
          formatter: (value) => `€ ${value}`
        }
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          gridLines: {
            display: false,
            color: `red`
          },
          ticks: {
            fontSize: 16
          }
        }],
      },
      title: {
        display: true,
        position: `left`,
        text: `MONEY`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {
  let events = [];
  let eventsNames = [].concat(TRANSFER_EVENTS);

  eventsNames.forEach((it, i) => {
    events[i] = points.filter((point) => point.type === `transfer` && point.name === it);
  });

  events = events.filter((it, i) => {
    if (it.length === 0) {
      eventsNames = [].concat(eventsNames.slice(0, i), eventsNames.slice(i + 1));
    }
    return it.length > 0;
  }).map((it) => it.length);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getNamesWithEmoji(eventsNames),
      datasets: [
        {
          data: events,
          backgroundColor: `white`
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          color: `black`,
          clamp: true,
          anchor: `end`,
          align: `left`,
          font: {
            size: 14
          },
          textAlign: `center`,
          padding: 2,
          formatter: (value) => `${value}x`
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            color: `red`
          },
          ticks: {
            fontSize: 16
          }
        }],
      },
      title: {
        display: true,
        position: `left`,
        text: `TRANSPORT`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false
      }
    }
  });
};

const renderTimeChart = (timeCtx, points) => {
  let eventsNames = [].concat(TRANSFER_EVENTS, ACTIVITY_EVENTS);
  let durations = [];

  eventsNames.forEach((it, i) => {
    durations[i] = points.filter((point) => point.name === it)
      .map((point) => getDatesDiff(point.endDate, point.startDate));
  });

  durations = durations.map((it) => convertMsToHours(calculateSum(it)));

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getNamesWithEmoji(eventsNames),
      datasets: [
        {
          data: durations,
          minBarLength: 40,
          backgroundColor: `white`
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          color: `black`,
          clamp: true,
          anchor: `end`,
          align: `left`,
          font: {
            size: 14
          },
          textAlign: `center`,
          padding: 2,
          formatter: (value) => {
            return value === 0 ? `< 1H` : `${value}H`;
          }
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            color: `red`
          },
          ticks: {
            fontSize: 16
          }
        }],
      },
      title: {
        display: true,
        position: `left`,
        text: `TIME SPENT`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>
  `;
};

class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._points = pointsModel.getPoints();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._points);
  }

  show() {
    super.show();

    this.rerender(this._pointsModel.getPoints());
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._transportChart = renderTransportChart(transportCtx, this._points);
    this._timeChart = renderTimeChart(timeCtx, this._points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}

export default Statistics;
