import {parseString} from 'xml2js'
var Utils = (function () {
  var parseXMLAsync = function (response, callback) {
    parseString(response, function (err, result) {
      callback(null, result);
    });
  };
  return {
    extractWPSOutputPath: function (result) {
      //console.log(result);
      let outputPath = "";
      if (result["wps:ExecuteResponse"]["wps:Status"][0]["wps:ProcessSucceeded"].length) {
        let outputs = result["wps:ExecuteResponse"]["wps:ProcessOutputs"][0]["wps:Output"];
        outputs.forEach(function (output) {
          // hardcoding because pywps seems to return different things
          if (output["ows:Identifier"][0] === "output" || output["ows:Identifier"][0] === "search_result") {
            outputPath = output["wps:Reference"][0].$.href || output["wps:Reference"][0].$["xlink:href"];
          }
        });
        console.log("WPS Successfull Response with path: " + outputPath);
        return outputPath;
      } else {
        return "WPS Failed Response";
      }
    },
    parseXMLThunk: function (response) {
      return function (callback) {
        parseXMLAsync(response, callback);
      };
    }
  };
})();
export default Utils
