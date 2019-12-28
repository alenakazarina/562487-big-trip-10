import AbstractComponent from './abstract-component';

class Loader extends AbstractComponent {
  getTemplate() {
    return `
      <p class="trip-events__msg">Loading...</p>
    `;
  }
}

export default Loader;
