import AbstractComponent from './abstract-component';

class AddEventButton extends AbstractComponent {
  getTemplate() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
  }

  setDisabled(value) {
    this._element.disabled = value;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

export default AddEventButton;
