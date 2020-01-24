import AbstractComponent from './abstract-component';

const HIDE_CLASS = `trip-events__msg--hidden`;

class NoPoints extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg opacity--pulse"></p>`;
  }

  setMessage(text) {
    this.getElement().innerText = text;
  }

  show() {
    this.getElement().classList.remove(HIDE_CLASS);
  }

  hide() {
    this.getElement().classList.add(HIDE_CLASS);
  }
}

export default NoPoints;
