import React from 'react';

class CityList extends React.Component {
  render() {
    let listItems = this.props.cities.map((city) => {
      return (
        <li key={city.id}>
          <input type="checkbox" value={city.id} onChange={this.props.onChange} checked={city.visible}/>{city.name}
        </li>
      );
    });
    return (
      <ul className='visibleList'>
        {listItems}
      </ul>
    )
  }
}

export default CityList;
