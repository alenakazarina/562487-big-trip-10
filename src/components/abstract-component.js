import {createElement} from '../utils/render';

const HIDE_CLASS = `visually-hidden`;

class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this._element.classList.remove(HIDE_CLASS);
  }

  hide() {
    this._element.classList.add(HIDE_CLASS);
  }
}

export default AbstractComponent;
