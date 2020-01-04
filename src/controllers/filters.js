import FiltersComponent from '../components/filters';
import {render, replace} from '../utils/render';
import {FilterType} from '../const';

class FiltersController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;

    this._container = container;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.addDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isEmpty: this._pointsModel.getPointsByFilter(filterType).length === 0,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filtersComponent;

    this._filtersComponent = new FiltersComponent(filters);

    if (oldComponent) {
      replace(this._filtersComponent, oldComponent);
    } else {
      render(container, this._filtersComponent.getElement());
    }
    this._filtersComponent.setFiltersChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(this._activeFilterType);
  }

  _onDataChange() {
    this.render();
  }
}

export default FiltersController;
