import config from '../../../config';
import request from 'koa-request';
import Utils from './../../Utils';
var consumer = (function () {
  // this creates the string for whatever comes after DataInputs=
  // which is stranglely formed, that is, separated by semicolons, colons and commas
  // eg DataInputs=url=www.url.com;constrainst=model:donald,experiment:h3dg
  var urlEncode = function (params) {
    let str = [];
    console.log(params);
    for (var param in params) {
      if (Object.prototype.hasOwnProperty.call(params, param)) {
        str.push(encodeURIComponent(param) + '=' + encodeURIComponent(params[param]));
      }
    }
    return str.join(';');
  };
  return {
    resolve: function * (next) {
      console.log('consuming:', this.params.identifier);
      let response;
      let url;
      switch (this.params.identifier) {
        case 'execute':
          let options = {
            method: 'POST',
            headers: {
              Authorization: 'Basic UGhvZW5peDpxd2VydHk=',
              'Content-Type': 'multipart/form-data'
            },
            url: 'https://outarde.crim.ca:8443/processes/execute?wps=emu_&process=helloworld',
            form: {
              user: 'koa form data',
              submit: 'submit'
            },
            rejectUnauthorized: false
          };
          console.log('options:', options);
          response = yield request(options);
          this.body = response.body;
          break;
        case 'pavicsearch':
          url = config.pavics_pywps_path + urlEncode(this.request.query);
          console.log('consuming: ' + url);
          response = yield request(url);
          let xmlToJson = yield Utils.parseXMLThunk(response.body);
          let jsonTempUrl = Utils.extractWPSOutputPath(xmlToJson);
          response = yield request(jsonTempUrl);
          this.body = response.body;
          break;
        case 'plotly':
          url = 'http://132.217.140.45:8009/pywps?service=WPS&request=execute&version=1.0.0' +
            '&identifier=ncplotly&DataInputs=opendap_url=' +
            'http://132.217.140.45:8083/thredds/dodsC/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc;' +
            'variable_name=' + this.request.query.variable_name +
            ';time_initial_indice=' + this.request.query.time_initial_indice +
            ';time_final_indice=' + this.request.query.time_final_indice +
            ';spatial1_initial_indice=' + this.request.query.spatial1_initial_indice +
            ';spatial1_final_indice=' + this.request.query.spatial1_final_indice +
            ';spatial2_initial_indice=' + this.request.query.spatial2_initial_indice +
            ';spatial2_final_indice=' + this.request.query.spatial2_final_indice;
          response = yield request(url);
          console.log(url);
          let xml = yield Utils.parseXMLThunk(response.body);
          let jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          console.log('json path: ', jsonPath);
          this.body = response.body;
          break;
      }
    }
  };
})();
export default consumer;
