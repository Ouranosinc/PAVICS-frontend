import React from 'react'
import classes from './OLExternalComponent.scss'
import {Map, View, Feature, source, layer, geom} from 'ol-react-renaud009';
require("openlayers/css/ol.css");


class OLExternalComponent extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  onNavigation () {

  }

  render () {
    const ViewComponent = <View resolution={10000} center={[0, 0]}/>;
    const actions = {
      "onNavigation": this.onNavigation
    };
    return (
      <div className={classes.mapCustom}>
        <Map view={ViewComponent} actions={actions}>
          <layer.Tile>
            <source.MapQuest layer="osm" />
          </layer.Tile>
          <layer.Vector actions={actions}>
            <source.Vector actions={actions}>
              <Feature id="123" style={{stroke: {color: [255, 0, 0, 1]}}}>
                <geom.LineString>
                  {[[0, 0], [100000, 0], [100000, 100000], [0, 100000]]}
                </geom.LineString>
              </Feature>
            </source.Vector>
          </layer.Vector>
        </Map>
      </div>
    )
  }
}

export default OLExternalComponent
