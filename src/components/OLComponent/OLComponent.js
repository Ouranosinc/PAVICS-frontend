import React from 'react'
//import classes from './CesiumComponent.scss'
import ol from 'openlayers';

require("openlayers/css/ol.css");
require("./OLComponent.css")

class OLComponent extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    // OL map
    var placeLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        //url: "http://www.geoforall.org/locations/OSGEoLabs.json" raises
        //Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://www.geoforall.org/locations/OSGEoLabs.json. (Reason: CORS header 'Access-Control-Allow-Origin' missing).
        url: "OSGEoLabs.json"
      })
    });

    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        placeLayer
      ],
      view: new ol.View({
        center: [949282, 6002552],
        zoom: 4
      })
    });

    var popupElement = document.getElementById('popup');
    var popup = new ol.Overlay({
      element: popupElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    map.addOverlay(popup);
  }


  render () {
    return(
      <div className="row">
        <div className="col-md-2 col-lg-2">
          <div className="panel panel-default">
            <div className="panel-body">
              ...
            </div>
          </div>
        </div>
        <div className="col-md-10 col-lg-10">
          <div className="panel panel-default">
            <div className="panel-body">
              <div id="map" className="map">
                <div id="popup" className="ol-popup"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OLComponent
