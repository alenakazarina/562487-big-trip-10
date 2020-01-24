import AbstractComponent from './abstract-component';
import {remove} from '../utils/render';

const createModalTemplate = (message) => {
  return `
    <div class="modal-view modal">
      <div class="modal-message">
        <p class="modal-message-text">${message}</p>
        <p class="modal-message-text">Please, try again later.</p>
        <button class="modal-close-btn btn">Ok</button>
      </div>
    </div>
  `;
};

class Modal extends AbstractComponent {
  constructor(err) {
    super();
    this._active = false;
    this._message = err;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  getTemplate() {
    return createModalTemplate(this._message);
  }

  show() {
    this.getElement().classList.add(`active`);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this.getElement().querySelector(`.modal-close-btn`).addEventListener(`click`, () => {
      this.hide();
    });
  }

  hide() {
    this.getElement().classList.add(`out`);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    setTimeout(() => {
      remove(this);
    }, 500);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.hide();
    }
  }
}

export default Modal;
