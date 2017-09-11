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
        case 'persist':
          let resource = this.request.query['resource'];
          let location = this.request.query['location'];
          let overwrite = this.request.query['overwrite'];
          let default_facets = this.request.query['default_facets'];
          url = `${config.pavics_malleefowl_path}?service=WPS&version=1.0.0&request=execute&identifier=persist&DataInputs=resource=${resource};location=${location};overwrite=${overwrite};default_facets=${default_facets}`;
          // url = `${config.pavics_malleefowl_path}?service=WPS&version=1.0.0&request=execute&identifier=persist&DataInputs=resource=http://pluvier.crim.ca:38093/wpsoutputs/flyingpigeon/ncout-5596d08c-8e76-11e7-bcf1-0242ac120006.nc;location=/workspaces/david/{yolo}/tata2.nc;overwrite=true;default_facets={yolo:valeur}`;
          console.log('persist a file:', url);
          let options = {
            headers: {
              'Cookie': "auth_tkt=813d148e733c8f0f13a22dd37b84df92ad894f1cfb8a97bc03692adba53af8ba2a0cf32a7fcd3cb95d8c07ca4bbf9da87acefac5b075f52d1547476072e7b91e59a86d314!userid_type:int; auth_tkt=813d148e733c8f0f13a22dd37b84df92ad894f1cfb8a97bc03692adba53af8ba2a0cf32a7fcd3cb95d8c07ca4bbf9da87acefac5b075f52d1547476072e7b91e59a86d314!userid_type:int"
            },
            url: url
          };
          response = yield request(options);
          xml = yield Utils.parseXMLThunk(response.body);
          if (xml['wps:ExecuteResponse']['wps:Status'][0]['wps:ProcessSucceeded']) {
            let jsonPath = Utils.extractWPSOutputPath(xml);
            console.log('persist result path:', jsonPath);
            response = yield request(jsonPath);
            this.body = {url: JSON.parse(response.body)[0]};
          } else {
            this.status = 500;
            this.body = {message: xml['wps:ExecuteResponse']['wps:Status'][0]['wps:ProcessFailed'][0]['wps:ExceptionReport'][0]['ows:Exception'][0]['ows:ExceptionText'][0]};
          }
      }
    }
  };
})();
export default consumer;
