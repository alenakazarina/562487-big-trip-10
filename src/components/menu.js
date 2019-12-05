import {createElement} from '../utils';

const MENU_TABS = [
  `Table`,
  `Stats`
];

const createTab = (title, isActive) => {
  const activeClass = isActive ? `trip-tabs__btn--active` : ``;

  return `
    <a class="trip-tabs__btn ${activeClass}" href="#">${title}</a>
  `;
};

const createMenuTemplate = () => {
  const isActive = Math.random() > 0.5;
  const tabsTemplate = MENU_TABS.map((it) => createTab(it, isActive)).join(`\n`);

  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `;
};

class Menu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate();
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
}

export default Menu;
