import AbstractComponent from './abstract-component';

const createModalTemplate = (message) => {
  return `
    <div class="modal-container">
      <div class="modal-background">
        <div class="modal">
          <p class="modal-text">${message}</p>
          <p class="modal-text">Please, try again later.</p>
        </div>
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
    this._onClickHandler = this._onClickHandler.bind(this);
  }

  getTemplate() {
    return createModalTemplate(this._message);
  }

  show() {
    this.getElement().classList.add(`one`);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`click`, this._onClickHandler);
  }

  hide() {
    this.getElement().classList.add(`out`);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`click`, this._onClickHandler);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.hide();
    }
  }

  _onClickHandler() {
    this.hide();
  }
}

export default Modal;
