import FiltersComponent from '../components/filters';
import {render} from '../utils/render';
import {FilterType} from '../const';

class FiltersController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;

    this._container = container;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = new FiltersComponent(this._activeFilterType);
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    render(this._container, this._filtersComponent.getElement());
    this._filtersComponent.setFiltersChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(this._activeFilterType);
  }
}

export default FiltersController;
