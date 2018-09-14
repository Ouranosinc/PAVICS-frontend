import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as layerDatasetActions } from './../../redux/modules/LayerDataset';
import * as constants from './../../constants';
import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';
import Map from 'ol/Map';
import View from 'ol/View';
import MousePosition from 'ol/control/MousePosition';
import { defaults as ControlDefaults, ScaleLine, ZoomSlider } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { Fill, Text, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import { add, createStringXY } from 'ol/coordinate';
import { transform } from 'ol/proj';

export class OLDatasetRenderer extends React.Component {
  static propTypes = {
    layerDataset: PropTypes.object.isRequired,
    layerDatasetActions: PropTypes.object.isRequired,
    layerIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.instanceOf(Map)
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const { map, layerDataset } = nextProps;
    const newDataset = layerDataset.currentDisplayedDataset;
    const oldDataset = this.props.layerDataset.currentDisplayedDataset;
    const hasDisplayedDataset = this.hasCurrentlyDisplayedDataset();

    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
    }
    if (layerDataset.currentDateTime && layerDataset.currentDateTime !== this.props.layerDataset.currentDateTime) {
      if (this.source) {
        this.source.updateParams({TIME: layerDataset.currentDateTime});
        this.source.setTileLoadFunction(this.source.getTileLoadFunction());
        this.source.changed();
      }
    }
    if (layerDataset.selectedColorPalette && layerDataset.selectedColorPalette !== this.props.layerDataset.selectedColorPalette) {
      this.updateColorPalette(layerDataset.selectedColorPalette);
    }
    // if there is a displayed dataset and the new one can't be shown on the map (ie having wmsUrls), remove the layer
    if ( hasDisplayedDataset && !this.datasetHasWmsUrls(newDataset) ) {
      map.removeLayer(this.layer);
      this.layer = null;
    }

    // If new data can be shown on the map (ie having wmsUrls), verify something has really changed
    if(this.datasetHasWmsUrls(newDataset)) {
      // if the opacity has changed, just change opacity
      if ( newDataset.opacity !== oldDataset.opacity ) {
        this.layer.setOpacity(newDataset.opacity);
      }

      /*
       We want to update the selected dataset when
       - there is actually a change of the selected dataset (dataset_id/uniqueLayerSwitcherId
       - the time has changed so much that a new file is needed (currentFileIndex changed)
       - FIXME: when the min/max has changed
       */
      if (newDataset.currentFileIndex !== oldDataset.currentFileIndex ||
        newDataset['dataset_id'] !== oldDataset['dataset_id'] ||
        newDataset['uniqueLayerSwitcherId'] !== oldDataset['uniqueLayerSwitcherId'] ||
        ( newDataset['variable_min'] !== oldDataset['variable_min'] || newDataset['variable_max'] !== oldDataset['variable_max'])) {
        this.updateDatasetWmsLayer(newDataset);
      }
    }

  }

  init(map) {

  }

  createDatasetLayer (minMaxBracket, wmsLayerName, resourceUrl, opacity, colorPalette) {
    const wmsParams = {
      'COLORSCALERANGE': minMaxBracket,
      'ABOVEMAXCOLOR': 'extend',
      'TRANSPARENT': 'TRUE',
      'STYLES': colorPalette,
      'LAYERS': wmsLayerName,
      'EPSG': '4326',
      'LOGSCALE': false,
      'crossOrigin': 'anonymous',
      'BGCOLOR': 'transparent',
      'SRS': 'EPSG:4326',
      'TIME': ''
    };

    this.props.map.removeLayer(this.layer);
    // delete this.layer;

    this.source = new TileWMS({
      url: resourceUrl,
      params: wmsParams
    });

    this.layer = new TileLayer({
      visible: true,
      title: this.props.layerName,
      opacity: opacity,
      source: this.source,
      // extent: extent
    });
    this.layer.set('nameId', this.props.layerName);
    this.props.map.getLayers().insertAt(this.props.layerIndex, this.layer);
  }

  /*
   routine fetches capabilities from a wms url, then creates a layer from it
   it expects the dataset to have informations about its wms_urls
   at this point in time, the informations stored in the dataset are assumed to be valid

   TODO we refetch the capabilities every time we make a modification to the dataset, but this is inefficient
   we could only fetch these when we change dataset, no need to reload only if we change the min max or opacity
   */
  updateDatasetWmsLayer (dataset) {
    console.log('setting new dataset layer', dataset);
    const currentWmsCapabilitiesUrl = dataset.wms_url[dataset.currentFileIndex];
    NotificationManager.info(`Dataset is being loaded on the map, it may take a few seconds...`, 'Information', 3000);

    if(currentWmsCapabilitiesUrl && currentWmsCapabilitiesUrl.length) {
      myHttp.get(currentWmsCapabilitiesUrl)
        .then(response => {
          if(response.status === 200) {
            return response.text();
          } else {
            // Typically: 401 Unauthorized
            throw new Error(`${response.status} ${response.statusText}`)
          }
        })
        .then(text => {
          const parser = new WMSCapabilities();
          let capabilities = "";
          try {
            capabilities = parser.read(text);
            console.log('fetched capabilities %o for wms url %s', capabilities, currentWmsCapabilitiesUrl);
          } catch(err){
            // The server might still return a code 200 containing an error
            // Might be an Apache error returning HTML containing H1 tag, Else just return everything
            let h1 = '';
            text.replace(/<h1>(.*?)<\/h1>/g, (match, g1) => h1 = g1);
            throw new Error((h1.length)? h1: text)
          }
          const index = currentWmsCapabilitiesUrl.indexOf('?');
          if(index < 0) {
            throw new Error('Could not find exact WMS Server URL needed for following GetMetadata requests');
          }
          const wmsServerUrl = currentWmsCapabilitiesUrl.substring(0, index);
          // We cannot trust anymore what's returned by GetCapabilities: capabilities['Service']['OnlineResource'];

          /*
           here we assume that the layer that actually contains the information we want to display is the first one of the dataset
           for instance, there could be layers containing lat or lon in the return values of the capabilities
           hopefully the relevant variable will always be the first one
           */
          const layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
          const layerName = layer['Name'];
          const minMaxBracket = `${dataset['variable_min']},${dataset['variable_max']}`;
          console.log('current dataset min max bracket: %s', minMaxBracket);
          this.createDatasetLayer(minMaxBracket, layerName, wmsServerUrl, dataset.opacity, `default-scalar/${dataset.variable_palette}`);

          if (layer['Dimension']) {
            const timeDimension = this.findDimension(layer['Dimension'], 'time');
            const date = timeDimension.values.substring(0, 24);
            this.props.layerDatasetActions.fetchWMSLayerTimesteps(wmsServerUrl, layerName, date);
            // this.props.layerDatasetActions.setCurrentDateTime(date);
          }

          this.props.layerDatasetActions.setSelectedDatasetCapabilities(capabilities);
          this.props.layerDatasetActions.fetchWMSLayerDetails(wmsServerUrl, layerName);
          // Normally fetched entirely by OpenLayers, but we want to an error when returning an error: ex. 401 Unauthorized
          this.props.layerDatasetActions.testWMSGetMapPermission(wmsServerUrl, layerName);
        })
        .catch(err => {
          console.log(err);
          NotificationManager.error(`Method GetCapabilities failed at being fetched from the NcWMS2 server: ${err}`, 'Error', 10000);
        });
    }
  }

  updateColorPalette (palette) {
    if (this.layer) {
      this.source.updateParams({
        'STYLES': `default-scalar/${palette}`
      });
    } else {
      NotificationManager.warning('Please display a dataset before changing the color palette.', 'Warning', 10000);
    }
  }

  findDimension (dimensions, dimensionName) {
    for (let i = 0; i < dimensions.length; i++) {
      if (dimensions[i]['name'] === dimensionName) {
        return dimensions[i];
      }
    }
  }

  datasetHasWmsUrls (dataset) {
    return !!(dataset.wms_url && dataset.wms_url.length > 0);
  }

  /*
   OpenLayers inner workings are somewhat obfuscated.
   Here I assume that for open layers to display something, it needs this "state_" property,
   that contains opacity, layer title, it's visibility, and a few other things
   This is a bit critical, as it decides whether or not the app considers that there is a displayed dataset
   */
  hasCurrentlyDisplayedDataset () {
    return this.layer && this.layer.hasOwnProperty('state_');
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerDataset: state.layerDataset,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    layerDatasetActions: bindActionCreators({...layerDatasetActions}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLDatasetRenderer)
