import config from "../../../config"
import request from 'koa-request'
import {parseString} from 'xml2js'
import Utils from './../../Utils'
var consumer = (function () {

  // this creates the string for whatever comes after DataInputs=
  // which is stranglely formed, that is, separated by semicolons, colons and commas
  // eg DataInputs=url=www.url.com;constrainst=model:donald,experiment:h3dg
  var urlEncode = function (params) {
    let str = [];
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        str.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
      }
    }
    return str.join(";");
  };
  return {
    resolve: function *(service) {
      switch (service) {
        case "pavicsearch":
          let url = config.pavics_pywps_path + urlEncode(this.request.query);
          console.log("consuming: " + url);
          let response = yield request(url);
          let xmlToJson = yield Utils.parseXMLThunk(response.body);
          let jsonTempUrl = Utils.extractWPSOutputPath(xmlToJson);
          response = yield request(jsonTempUrl);
          this.body = response.body;
      }
    }
  };
})();
export default consumer;
