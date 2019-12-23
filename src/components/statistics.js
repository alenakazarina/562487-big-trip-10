import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Preposition} from '../const';

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

const calculateSum = (items) => items.reduce((acc, it) => {
  return it + acc;
}, 0);

const calculateEventCosts = (points) => {
  return points.map((point) => point.price + calculateSum(point.offers.map((offer) => offer.price)));
};

const renderMoneyChart = (moneyCtx, points) => {
  const costs = calculateEventCosts(points);
  const events = points.map((it) => {
    const emoji = EmojiValue[it.name.split(`-`)[0].toUpperCase()];
    const preposition = Preposition[it.type];
    return `${emoji} ${it.name} ${preposition} ${it.destination}`;
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: events,
      datasets: [
        {
          data: costs
        }]
    },
    options: {
      plugins: {
        datalabels: {
          color: `black`,
          clamp: true,
          anchor: `end`,
          align: `left`,
          formatter: (value, ctx) => {
            return `€ ${ctx.chart.data.datasets[0].data[ctx.dataIndex]}`;
          }
        }
      },
      title: {
        display: true,
        position: `left`,
        text: `MONEY`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        display: false,
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
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

    this.rerender(this._points);
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

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
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
