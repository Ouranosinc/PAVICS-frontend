import request from 'koa-request';
import config from '../../../config';
import Utils from './../../Utils';

var wps = (function () {
  return {
    getFacets: function * list (next) {
      if (this.method !== 'GET') return yield next;

      let url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=pavicsearch&DataInputs=facets=*&limit=0&distrib=false`;
      console.log('consuming: ' + url);
      let response = yield request(url);
      let xmlToJson = yield Utils.parseXMLThunk(response.body);
      let jsonTempUrl = Utils.extractWPSOutputPath(xmlToJson);
      response = yield request(jsonTempUrl);

      let json = JSON.parse(response.body);
      response = [];
      console.log('yolo');
      json['responseHeader']['params']['facet.field'].forEach(function (key) {
        response.push({
          key: key,
          values: []
        });
      });
      var facetFields = json['facet_counts']['facet_fields'];
      for (var facetKey in facetFields) {
        if (facetFields.hasOwnProperty(facetKey)) {
          let values = [];
          let keyIndex = response.findIndex(x => x.key === facetKey);
          for(let i = 0; i < facetFields[facetKey].length; i = i + 2) {
            var thisValue = {
              value: facetFields[facetKey][i],
              count: facetFields[facetKey][i+1],
            };
            values.push(thisValue);
          }
          values.sort((a, b) => a.value.localeCompare(b.value));
          response[keyIndex].values = values;
        }
      }
      console.log(response);
      this.body = response;
    },
    getClimateIndicators: function * () {
      // hardcoded for now until we know for sure where these capabilities will be coming from
      let response = yield request('http://132.217.140.31:8092/wps?service=WPS&version=1.0.0&request=DescribeProcess&identifier=cdo_operation');
      let json = yield Utils.parseXMLThunk(response.body);
      let inputs = json['wps:ProcessDescriptions']['ProcessDescription'][0]['DataInputs'][0]['Input'];
      let allowedValues = inputs[1]['LiteralData'][0]['ows:AllowedValues'][0]['ows:Value'];
      this.body = allowedValues.map((x, i) => {
        return {key: i, value: x};
      });
    }
  };
})();
export default wps;
