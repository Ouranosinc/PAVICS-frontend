import config from "../../../config"
import request from 'koa-request'
import {parseString} from 'xml2js'
var consumer = (function () {
  var
    urlEncode = function (params) {
      let str = [];
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          str.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
        }
      }
      return str.join(";");
    },
    getJsonUrl = function (response) {
      return function (callback) {
        sendJsonBack(response, callback);
      }
    },
    sendJsonBack = function (response, callback) {
      // shamelessly copied from facets.js
      parseString(response, function (err, result) {
        // ugly hand carved path because wps.
        // will hopefully not change in the future because wps.
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
