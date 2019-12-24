import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TRANSFER_EVENTS, ACTIVITY_EVENTS} from '../const';
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

const getMoneyChartData = (points) => {
  let costs = [];
  const eventsNames = [].concat(TRANSFER_EVENTS, ACTIVITY_EVENTS);
  eventsNames.forEach((it, i) => {
    costs[i] = calculateSum(points.filter((point) => point.name === it).map((point) => point.price));
  });
  return [eventsNames, costs];
};

const renderMoneyChart = (moneyCtx, points) => {
  const [eventsNames, costs] = getMoneyChartData(points);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getNamesWithEmoji(eventsNames),
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
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getTransportChartData = (points) => {
  let transportEvents = [];
  let eventsNames = [];

  TRANSFER_EVENTS.forEach((it, i) => {
    transportEvents[i] = points.filter((point) => point.type === `transfer` && point.name === it);
    eventsNames[i] = transportEvents[i].length ? it : ``;
  });
  const eventsCounts = transportEvents.filter((it) => it.length > 0).map((it) => it.length);
  return [eventsNames.filter((it) => it !== ``), eventsCounts];
};

const renderTransportChart = (transportCtx, points) => {
  const [eventsNames, eventsCounts] = getTransportChartData(points);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getNamesWithEmoji(eventsNames),
      datasets: [
        {
          data: eventsCounts,
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
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getTimeChartData = (points) => {
  let eventsNames = [].concat(TRANSFER_EVENTS, ACTIVITY_EVENTS);
  let durations = [];
  eventsNames.forEach((it, i) => {
    durations[i] = points.filter((point) => point.name === it)
      .map((point) => getDatesDiff(point.endDate, point.startDate));
  });
  durations = durations.map((it) => convertMsToHours(calculateSum(it)));
  return [eventsNames, durations];
};

const renderTimeChart = (timeCtx, points) => {
  const [eventsNames, durations] = getTimeChartData(points);
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
        text: `TIME SPEND`,
        fontSize: 24,
        fontColor: `#000000`
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (points) => {
  const [labelsForMoneyChart, moneyChartData] = getMoneyChartData(points);
  const [labelsForTransportChart, transportChartData] = getTransportChartData(points);
  const [labelsForTimeChart, timeChartData] = getTimeChartData(points);

  const ariaLabelForMoneyChart = `Bar Chart Values in Euros. `.concat(labelsForMoneyChart.map((it, i) => `${it}: ${moneyChartData[i]}`).join(`, `));
  const ariaLabelForTransportChart = `Bar Chart Values as a number of times. `.concat(labelsForTransportChart.map((it, i) => `${it}: ${transportChartData[i]}`).join(`, `));
  const ariaLabelForTimeChart = `Bar Chart Values in hours. `.concat(labelsForTimeChart.map((it, i) => `${it}: ${timeChartData[i]}`).join(`, `));

  return `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <h3 class="visually-hidden">Money chart</h3>
        <canvas class="statistics__chart  statistics__chart--money" width="900" role="img" aria-label="${ariaLabelForMoneyChart}"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <h3 class="visually-hidden">Transport chart</h3>
        <canvas class="statistics__chart  statistics__chart--transport" width="900" role="img" aria-label="${ariaLabelForTransportChart}"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <h3 class="visually-hidden">Time spend chart</h3>
        <canvas class="statistics__chart  statistics__chart--time" width="900" role="img" aria-label="${ariaLabelForTimeChart}"></canvas>
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
