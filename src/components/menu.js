import AbstractComponent from './abstract-component';
import {MenuTab} from '../const';

const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

const createTab = (title, active) => {
  const isActiveClass = title === active ? ACTIVE_TAB_CLASS : ``;

  return `
    <button class="trip-tabs__btn ${isActiveClass}" value="${title}">${title}</button>
  `;
};

const createMenuTemplate = (active) => {
  const tabsTemplate = Object.values(MenuTab).map((it) => createTab(it, active)).join(`\n`);

  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `;
};

class Menu extends AbstractComponent {
  constructor() {
    super();
    this._active = MenuTab.TABLE;
    this._tableTab = null;
    this._statsTab = null;
  }

  getTemplate() {
    return createMenuTemplate(this._active);
  }

  setClickHandler(handler) {
    this._tableTab = this._element.children[0];
    this._statsTab = this._element.children[1];
    this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((tab) => {
      tab.addEventListener(`click`, handler);
    });
  }

  setActiveTab(active) {
    if (active.value === this._active) {
      return;
    }
    this._element.querySelector(`.${ACTIVE_TAB_CLASS}`).classList.remove(ACTIVE_TAB_CLASS);
    active.classList.add(ACTIVE_TAB_CLASS);
    this._active = active.value;
  }
}

export default Menu;
