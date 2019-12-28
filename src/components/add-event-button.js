import AbstractComponent from './abstract-component';

class AddEventButton extends AbstractComponent {
  getTemplate() {
    return `
      <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
    `;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setDisabled(value) {
    this._element.disabled = value;
  }
}

export default AddEventButton;
