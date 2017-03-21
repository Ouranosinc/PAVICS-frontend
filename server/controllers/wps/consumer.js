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
      let xml;
      switch (this.params.identifier) {
        case 'pavicsearch':
          // url = config.pavics_pywps_path + urlEncode(this.request.query);
          url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=pavicsearch&DataInputs=${urlEncode(
            this.request.query
          )}`;
          console.log('consuming: ' + url);
          response = yield request(url);
          let xmlToJson = yield Utils.parseXMLThunk(response.body);
          let jsonTempUrl = Utils.extractWPSOutputPath(xmlToJson);
          response = yield request(jsonTempUrl);
          this.body = response.body;
          break;
        case 'plotly':
          url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0` +
            `&identifier=ncplotly&DataInputs=opendap_url=${this.request.query['opendap_url']}` +
            `;variable_name=${this.request.query['variable_name']}` +
            `;time_initial_indice=` + this.request.query['time_initial_indice'] +
            `;time_final_indice=` + this.request.query['time_final_indice'] +
            `;spatial1_initial_indice=` + this.request.query['spatial1_initial_indice'] +
            `;spatial1_final_indice=` + this.request.query['spatial1_final_indice'] +
            `;spatial2_initial_indice=` + this.request.query['spatial2_initial_indice'] +
            `;spatial2_final_indice=` + this.request.query['spatial2_final_indice'];
          console.log('fetching plotly data:', url);
          response = yield request(url);
          xml = yield Utils.parseXMLThunk(response.body);
          jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          console.log('json path: ', jsonPath);
          this.body = response.body;
          break;
        case 'getpoint':
          let opendapUrl = this.request.query['opendapUrl'];
          let variable = this.request.query['variable'];
          let lon = this.request.query['lon'];
          let lat = this.request.query['lat'];
          let time = this.request.query['time'];
          let dataInputs = `opendap_url=${opendapUrl};variable=${variable};nearest_to=lon:${lon};nearest_to=lat:${lat};nearest_to=time:${time}`;
          url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=getpoint&DataInputs=${dataInputs}`;
          console.log('getting point:', url);
          response = yield request(url);
          xml = yield Utils.parseXMLThunk(response.body);
          let jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          this.body = response.body;
          break;
        case 'crawl':
          let dataset = this.request.query['dateset_id'];
          url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=pavicrawler&storeExecuteResponse=true&DataInputs=targetfiles=${dataset}`;
          console.log('crawling a file:', url);
          response = yield request(url);
          xml = yield Utils.parseXMLThunk(response.body);
          // let jsonPath = Utils.extractWPSOutputPath(xml);
          // response = yield request(jsonPath);
          this.body = xml;
      }
    }
  };
})();
export default consumer;
