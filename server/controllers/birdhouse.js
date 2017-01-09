'use strict';
import config from '../../config';
import {parseString} from 'xml2js';
import request from 'koa-request';
// TODO probably not the place to hardcode this
const thredds = 'http://outarde.crim.ca:8083/thredds/wms/birdhouse/';
const wmsUrlSuffix = '?service=WMS&version=1.3.0&request=GetCapabilities';
// Explanation here http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/
function parseXMLThunk (response) {
  // console.log(response);
  return function (callback) {
    parseXMLAsync(response, callback);
  };
}
function parseXMLAsync (response, callback) {
  parseString(response, function (err, result) {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    callback(null, result);
  });
}
function analyseOutputs (outputs) {
  let id = false;
  outputs.map(elem => {
    if (elem['$']['mimeType'] === 'application/x-netcdf') {
      id = elem['ows:Identifier'][0];
    }
  });
  return id;
}
function findOutputByIdentifier (outputs, identifier) {
  let theOutput = false;
  outputs.map(elem => {
    if (elem['ows:Identifier'][0] === identifier) {
      theOutput = elem;
    }
  });
  return theOutput;
}
function makeWmsUrl (dataset) {
  return `${thredds}${dataset}${wmsUrlSuffix}`;
}
module.exports.fetchVisualizableLayer = function * list () {
  let statusLocation = this.query.status;
  let response = yield request({
    url: statusLocation
  });
  let json = yield parseXMLThunk(response.body);
  let responseBody = json['wps:ExecuteResponse'];
  let outputsDefs = responseBody['wps:OutputDefinitions'][0]['wps:Output'];
  let netcdfOutputIdentifier = analyseOutputs(outputsDefs);
  if (netcdfOutputIdentifier) {
    let output = findOutputByIdentifier(responseBody['wps:ProcessOutputs'][0]['wps:Output'], netcdfOutputIdentifier);
    if (output) {
      let refHref = output['wps:Reference'][0]['$']['href'].replace('http://outarde.crim.ca:8090/wpsoutputs/', '');
      let wmsHref = makeWmsUrl(refHref);
      let wmsResponse = yield request({
        url: wmsHref
      });
      let wmsResponseJson = yield parseXMLThunk(wmsResponse.body);
      // lotsa ['Layer'][0] because xmlThunkParser
      let layer = wmsResponseJson['WMS_Capabilities']['Capability'][0]['Layer'][0]['Layer'][0];
      let title = layer['Title'][0];
      let time = layer['Layer'][0]['Dimension'][0]['$']['default'];
      let name = layer['Layer'][0]['Name'][0];
      let timeSteps = layer['Layer'][0]['Dimension'][0]['_'].trim().split(',');
      this.body = {
        url: wmsHref,
        title: title,
        time: time,
        name: name,
        style: 'boxfill/occam',
        timeSteps: timeSteps
      };
      return;
    }
  }
  this.body = {
    error: 'no visualizable output'
  };
};
module.exports.getCapabilities = function * list (next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  let options = {
    url: config.pavics_birdhouse_path
  };
  // Yay, HTTP requests with no callbacks!
  let response = yield request(options);
  this.body = yield parseXMLThunk(response.body);
};

