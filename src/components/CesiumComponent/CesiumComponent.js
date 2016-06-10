import React from 'react';
import MapComponent from './MapComponent';
import CityList from './CityList';
require('./CesiumComponent.css');

class CesiumComponent extends React.Component {
  constructor () {
    super();
    this.state = {
      cities: require('./top10cities.json')
    };
  }

  _onCheckboxChange(event) {
    let cities = this.state.cities;
    let newCities = cities.map((city) => {
      let visible = (city.id === event.target.value) ? event.target.checked : city.visible;
      return {
        id: city.id,
        name: city.name,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
        visible: visible
      }
    });
    this.setState({
      cities: newCities
    })
  }

  render() {
    return (
    <div className="row">
      <div className="col-md-2 col-lg-2">
        <div className="panel panel-default">
          <div className="panel-body">
            <CityList cities={this.state.cities} onChange={this._onCheckboxChange.bind(this)}/>
          </div>
        </div>
      </div>
      <div className="col-md-10 col-lg-10">
        <div className="panel panel-default">
          <div className="panel-body">
            <MapComponent cities={this.state.cities}></MapComponent>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
export default CesiumComponent;
