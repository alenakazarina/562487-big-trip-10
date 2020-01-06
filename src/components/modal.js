import AbstractComponent from './abstract-component';

class Modal extends AbstractComponent {
  constructor() {
    super();
    this._active = false;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onClickHandler = this._onClickHandler.bind(this);
  }

  getTemplate() {
    return `
      <div class="modal-container">
        <div class="modal-background">
          <div class="modal">
            <p class="modal-text">Sync data failed 😕</p>
            <p class="modal-text">Please, reload the page.</p>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
            class="modal-svg"
            >
              <g transform="rotate(14.3104 50 50)">
                <path d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843" fill="none" stroke="#e15b64" stroke-width="12"></path>
                <path d="M49 3L49 27L61 15L49 3" fill="#e15b64"></path>
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
              </g>
            </svg>
          </div>
        </div>
      </div>
    `;
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
