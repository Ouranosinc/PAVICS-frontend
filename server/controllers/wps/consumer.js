import config from "../../../config"
import request from 'koa-request'
import {parseString} from 'xml2js'
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
  var getJsonUrl = function (response) {
    return function (callback) {
      sendJsonBack(response, callback);
    }
  };
  var sendJsonBack = function (response, callback) {
    // shamelessly copied from facets.js
    parseString(response, function (err, result) {
      // ugly hand carved path because wps.
      // is slightly different than standard wwps ones for now
      // technocally our wps response should come closer to the standard one in the  future
      let jsonUrl = result["wps:ExecuteResponse"]["wps:ProcessOutputs"][0]["wps:Output"][0]["wps:Data"][0]["wps:LiteralData"][0]["_"];
      callback(null, jsonUrl);
    });
  };
  return {
    resolve: function *(service) {
      switch (service) {
        case "pavicsearch":
          let url = config.pavics_pywps_path + urlEncode(this.request.query);
          console.log(url);
          let response = yield request(url);
          let jsonTempUrl = yield getJsonUrl(response.body);
          response = yield request(jsonTempUrl);
          this.body = response.body;
      }
    }
  };
})();
export default consumer;
