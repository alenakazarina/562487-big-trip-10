import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TRANSFER_EVENTS, ACTIVITY_EVENTS} from '../const';
import {calculateSum, getDatesDiff, getEventType} from '../utils/common';
import {sanitizeTemplate} from '../utils/render';

const MS_IN_HOUR = 1000 * 3600;

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
  return eventsNames.map((eventName) => {
    const emoji = EmojiValue[eventName.split(`-`)[0].toUpperCase()];
    return `${emoji} ${eventName.toUpperCase()}`;
  });
};

const convertMsToHours = (time) => Math.floor(time / MS_IN_HOUR);

const createChart = (ctx, chartText, chartLabels, chartData, chartFormatter) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getNamesWithEmoji(chartLabels),
      datasets: [
        {
          data: chartData,
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
          formatter: chartFormatter
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
        text: chartText,
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

const getMoneyChartData = (points) => {
  const costs = [];
  const eventsNames = [].concat(TRANSFER_EVENTS, ACTIVITY_EVENTS);
  eventsNames.forEach((eventName, i) => {
    costs[i] = calculateSum(points.filter((point) => point.type === eventName).map((point) => +point.price));
  });
  return [eventsNames, costs];
};

const renderMoneyChart = (moneyCtx, points) => {
  const [eventsNames, costs] = getMoneyChartData(points);
  const getFormat = (value) => `€ ${value}`;
  return createChart(moneyCtx, `MONEY`, eventsNames, costs, getFormat);
};

const getTransportChartData = (points) => {
  let transportEvents = [];
  const eventsNames = TRANSFER_EVENTS;

  TRANSFER_EVENTS.forEach((transferEvent, i) => {
    transportEvents[i] = points.filter((point) => getEventType(point.type) && point.type === transferEvent);
  });
  const eventsCounts = transportEvents.map((events) => events.length);
  return [eventsNames, eventsCounts];
};

const renderTransportChart = (transportCtx, points) => {
  let [eventsNames, eventsCounts] = getTransportChartData(points);
  if (eventsNames.length === 0) {
    eventsNames = TRANSFER_EVENTS;
    eventsCounts = TRANSFER_EVENTS.map(() => 0);
  }
  const getFormat = (value) => `${value}x`;
  return createChart(transportCtx, `TRANSPORT`, eventsNames, eventsCounts, getFormat);
};

const getTimeChartData = (points) => {
  const eventsNames = [].concat(TRANSFER_EVENTS, ACTIVITY_EVENTS);
  const durations = [];
  eventsNames.forEach((eventName, i) => {
    durations[i] = points.filter((point) => point.type === eventName)
      .map((point) => getDatesDiff(point.endDate, point.startDate));
  });
  return [eventsNames, durations.map((it) => convertMsToHours(calculateSum(it)))];
};

const renderTimeChart = (timeCtx, points) => {
  const [eventsNames, durations] = getTimeChartData(points);
  const getFormat = (value) => value === 0 ? `< 1H` : `${value}H`;
  return createChart(timeCtx, `TIME SPENT`, eventsNames, durations, getFormat);
};

const createStatisticsTemplate = (points) => {
  const [labelsForMoneyChart, moneyChartData] = getMoneyChartData(points);
  const [labelsForTransportChart, transportChartData] = getTransportChartData(points);
  const [labelsForTimeChart, timeChartData] = getTimeChartData(points);

  const ariaLabelForMoneyChart = `Bar Chart Values in Euros. `.concat(labelsForMoneyChart.map((label, i) => `${label}: ${moneyChartData[i]}`).join(`, `));
  const ariaLabelForTransportChart = `Bar Chart Values as a number of times. `.concat(labelsForTransportChart.map((label, i) => `${label}: ${transportChartData[i]}`).join(`, `));
  const ariaLabelForTimeChart = `Bar Chart Values in hours. `.concat(labelsForTimeChart.map((label, i) => `${label}: ${timeChartData[i]}`).join(`, `));

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
      <div class="statistics__item statistics__item--time-spent">
        <h3 class="visually-hidden">Time spent chart</h3>
        <canvas class="statistics__chart  statistics__chart--time" width="900" role="img" aria-label="${ariaLabelForTimeChart}"></canvas>
      </div>
    </section>
  `;
};

class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._points = pointsModel.getPointsAll();
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    const template = createStatisticsTemplate(this._points);
    return sanitizeTemplate(template);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;
    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();
    this.rerender(this._pointsModel.getPointsAll());
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
