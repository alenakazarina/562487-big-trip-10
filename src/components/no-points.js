import AbstractComponent from './abstract-component';

class NoPoints extends AbstractComponent {
  getTemplate() {
    return `
      <p class="trip-events__msg visually-hidden"></p>
    `;
  }

  setMessage(text) {
    this.getElement().innerText = text;
  }
}

export default NoPoints;
