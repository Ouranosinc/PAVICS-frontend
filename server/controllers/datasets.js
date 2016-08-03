'use strict';
import config from '../../config'
import { parseString } from 'xml2js'
import request from 'koa-request'

function parseXMLThunk(response){
  return function(callback) {
    parseXMLAsync(response, callback);
  };
}

function parseXMLAsync(response, callback){
  parseString(response, function (err, result) {
    callback(null, result);
  });
}

function extractWPSOutputPath(result){
  //console.log(result);
  let outputPath = "";
  if(result["wps:ExecuteResponse"]["wps:Status"][0]["wps:ProcessSucceeded"].length){
    let outputs = result["wps:ExecuteResponse"]["wps:ProcessOutputs"][0]["wps:Output"];
    outputs.forEach(function(output){
      if(output["ows:Identifier"][0] === "output"){
        outputPath = output["wps:Reference"][0].$.href;
      }
    });
    console.log("WPS Successfull Response with path: " + outputPath);
    return outputPath;
  }else{
    return "WPS Failed Response";
  }
}

module.exports.getDatasets = function * list(next) {
  let constraints = "";
  if ('GET' != this.method) return yield next;
  if (this.request.query.constraints){
    constraints = `;constraints=${this.request.query.constraints}`
    console.log("Found contraints: " + constraints);
  }
  if (this.request.query.facets){
    console.log(this.request.query.facets);
  }
  var optionsWPS = {
    url: config.pavics_solr_path + `/wps?service=WPS&version=1.0.0&request=Execute&identifier=esgsearch&DataInputs=url=http://pcmdi.llnl.gov/esg-search${constraints}`
  };
  let responseWPS = yield request(optionsWPS);
  let xmlToJson = yield parseXMLThunk(responseWPS.body)
  let wpsOutput = extractWPSOutputPath(xmlToJson);
  if(wpsOutput.length){
    var optionsJson = {
      url: wpsOutput
    };
    let responseJson = yield request(optionsJson);
    this.body = responseJson.body;
  }else{
    this.body = [];
  }
};
