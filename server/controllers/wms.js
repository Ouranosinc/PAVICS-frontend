'use strict';
import config from '../../config'
import { parseString } from 'xml2js'
import request from 'koa-request'

//Explanation here http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/
function parseXMLThunk(response, url, dataset){
  //console.log(response);
  return function(callback) {
    parseXMLAsync(response, url, dataset, callback);
  };
}

function parseXMLAsync(response, url, dataset, callback){
  parseString(response, function (err, result) {
    let response = [];
    result["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"][0]["Layer"].forEach(function(layer){
      response.push({
        wmsUrl: url,
        name: layer["Name"][0],
        layer: layer["Title"][0],
        dataset: dataset,
        boundingBox: layer["BoundingBox"][0].$
      })
    });
    response.sort(function(a, b){
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    });
    callback(null, response);
    //callback(null, result);
  });
}

module.exports.getLayers = function * list(next) {
  let dataset = "";
  let url = "";
  if ('GET' != this.method) return yield next;

  if (this.request.query.dataset){
    dataset = this.request.query.dataset;
    url = this.request.query.url;
    console.log("Found params: dataset: " + dataset + ", url: " + url);
  }else{
    //TODO: by default we target birdhouse ncWMS prototype server at this point
    dataset = "outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc";
    url = "http://132.217.140.31:8080/ncWMS2/wms";
  }
  //Ex:
  //url="http://132.217.140.31:8080/ncWMS2/wms"
  //dataset="outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"
  //http://132.217.140.31:8080/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc
  var options = {
    url: `${url}?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=${dataset}`
  };
  var response = yield request(options);
  this.body = yield parseXMLThunk(response.body, url, dataset);
};

