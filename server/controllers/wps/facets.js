'use strict';
import config from '../../../config';
import Utils from '../../Utils';
import request from 'koa-request';

var facets = (function () {
  return {
    getFacets: function * list (next) {
      if (this.method !== 'GET') return yield next;

      let url = config.pavics_pywps_path + 'facets=*&limit=0&distrib=false';
      console.log('consuming: ' + url);
      let response = yield request(url);
      let xmlToJson = yield Utils.parseXMLThunk(response.body);
      let jsonTempUrl = Utils.extractWPSOutputPath(xmlToJson);
      response = yield request(jsonTempUrl);

      // OLD WAY using wps consumer
      // let url = config.pavics_wpsconsumer_search_path + '?facets=*&limit=0&distrib=false';
      // let response = yield request(url); //Yay, HTTP requests with no callbacks!

      let json = JSON.parse(response.body);
      response = [];
      console.log(json);
      json['responseHeader']['params']['facet.field'].forEach(function (key) {
        response.push({
          key: key,
          values: []
        });
      });
      var facetFields = json['facet_counts']['facet_fields'];
      for (var object in facetFields) {
        if (facetFields.hasOwnProperty(object)) {
          let values = [];
          let index = response.findIndex(x => x.key === object);
          for (var value in facetFields[object]) {
            if (facetFields[object].hasOwnProperty(value)) {
              var thisValue = facetFields[object][value];
              if (thisValue === 0 || thisValue === '0') {
                continue;
              }
              values.push(thisValue);
            }
          }
          values.sort();
          response[index].values = values;
        }
      }
      this.body = response;
    }
  };
})();
export default facets;


