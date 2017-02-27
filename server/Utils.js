import {parseString} from 'xml2js';
var Utils = (function () {
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
  var parseXMLAsync = function (response, callback) {
    parseString(response, function (err, result) {
      if (err) {
        console.log(err);
      }
      callback(null, result);
    });
  };
  return {
    urlEncode: function (params) {
      urlEncode(params);
    },
    extractWPSOutputPath: function (result) {
      let outputPath = '';
      if (result['wps:ExecuteResponse']['wps:Status'][0]['wps:ProcessSucceeded'].length) {
        let outputs = result['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'];
        outputs.forEach(function (output) {
          // hardcoding because pywps seems to return different things
          // yeah, depending on the type of resource, the identifier is different
          // kinda defeats the purpose of having one wps response consumer
          // TODO please change this to always use the same identifier
          // later - actually, maybe we don't care at all to verify, just return that output url, and be done with it...
          // TODO verify that pywps will always only return one ouput
          // if that's the case, remove this loop and just return output['wps:Reference'][0].$.href || output['wps:Reference'][0].$['xlink:href'];
          // otherwise, just return an array of outputs with their identifier
          console.log('identifier:', output['ows:Identifier'][0]);
          if (
            output['ows:Identifier'][0] === 'output' ||
            output['ows:Identifier'][0] === 'search_result' ||
            output['ows:Identifier'][0] === 'plotly_result' ||
            output['ows:Identifier'][0] === 'point_result'
          ) {
            outputPath = output['wps:Reference'][0].$.href || output['wps:Reference'][0].$['xlink:href'];
          }
        });
        console.log('output path:', outputPath);
        if (outputPath === '') {
          console.log('No identifier was found');
          return 'Failed output path extraction';
        }
        console.log('WPS Successfull Response with path: ' + outputPath);
        return outputPath;
      } else {
        return 'WPS Failed Response';
      }
    },
    parseXMLThunk: function (response) {
      return function (callback) {
        parseXMLAsync(response, callback);
      };
    }
  };
})();
export default Utils;
