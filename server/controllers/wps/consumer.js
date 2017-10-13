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
      // if(next.cookies){
      //   console.log('NEXT COOKIE: '+ next.cookies.get('auth_tkt'))
      // }
      const currentCookie = this.cookies.get('auth_tkt');
      console.log('CURRENT COOKIE: ' + currentCookie);
      let options = {
        headers: {
          'Cookie': `auth_tkt=${currentCookie}`
        },
        url: ''
      };
      console.log('consuming:', this.params.identifier);
      let response;
      let xml;
      switch (this.params.identifier) {
        case 'pavicsearch':
          let constraints = '';
          let limit = '';
          let type = 'type=Dataset;'; // Default
          if (this.method !== 'GET') return yield next;
          if (this.request.query.type) type = `type=${this.request.query.type};`;
          if (this.request.query.limit) limit = `limit=${this.request.query.limit};`;
          if (this.request.query.constraints) constraints = `;constraints=${this.request.query.constraints};`;
          options.url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=pavicsearch&DataInputs=${limit}facets=*;${type}distrib=true${constraints}`;
          console.log('fetching pavicsearch: ', options.url);
          response = yield request(options);
          xml = yield Utils.parseXMLThunk(response.body);
          jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          this.body = response.body;
          break;
        case 'plotly':
          options.url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0` +
            `&identifier=ncplotly&DataInputs=opendap_url=${this.request.query['opendap_url']}` +
            `;variable_name=${this.request.query['variable_name']}` +
            `;time_initial_indice=` + this.request.query['time_initial_indice'] +
            `;time_final_indice=` + this.request.query['time_final_indice'] +
            `;spatial1_initial_indice=` + this.request.query['spatial1_initial_indice'] +
            `;spatial1_final_indice=` + this.request.query['spatial1_final_indice'] +
            `;spatial2_initial_indice=` + this.request.query['spatial2_initial_indice'] +
            `;spatial2_final_indice=` + this.request.query['spatial2_final_indice'];
          console.log('fetching plotly data:', options.url);
          response = yield request(options);
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
          options.url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=getpoint&DataInputs=${dataInputs}`;
          console.log('getting point:', options.url);
          response = yield request(options);
          xml = yield Utils.parseXMLThunk(response.body);
          let jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          this.body = response.body;
          break;
        case 'crawl':
          let dataset = this.request.query['dateset_id'];
          options.url = `${config.pavics_pywps_path}?service=WPS&request=execute&version=1.0.0&identifier=pavicrawler&storeExecuteResponse=true&DataInputs=targetfiles=${dataset}`;
          console.log('crawling a file:', options.url);
          response = yield request(options);
          xml = yield Utils.parseXMLThunk(response.body);
          // let jsonPath = Utils.extractWPSOutputPath(xml);
          // response = yield request(jsonPath);
          this.body = xml;
        case 'persist':
          let resource = this.request.query['resource'];
          let location = this.request.query['location'];
          let overwrite = this.request.query['overwrite'];
          let default_facets = this.request.query['default_facets'];
          options.url = `${config.pavics_malleefowl_path}?service=WPS&version=1.0.0&request=execute&identifier=persist&DataInputs=resource=${resource};location=${location};overwrite=${overwrite};default_facets=${default_facets}`;
          console.log('persist a file:', options.url);
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
        case 'visualize':
          let resources = this.request.query['resource']; //Array of strings
          if(!Array.isArray(resources)){
            resources = [resources]
          }
          options.url = `${config.pavics_malleefowl_path}?service=WPS&request=execute&version=1.0.0&identifier=visualize&storeExecuteResponse=true&DataInputs=`;
          console.log(resources);
          resources.forEach(res =>  {
            options.url += `resource=${res};`;
          });
          console.log('visualizing files:', options.url);
          response = yield request(options);
          xml = yield Utils.parseXMLThunk(response.body);
          jsonPath = Utils.extractWPSOutputPath(xml);
          response = yield request(jsonPath);
          this.body = response.body;
      }
    }
  };
})();
export default consumer;
