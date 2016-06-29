'use strict';
import { parseString } from 'xml2js'
import request from 'koa-request'

//Explanation here http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/
function parseXMLThunk(response){
  //console.log(response);
  return function(callback) {
    parseXMLAsync(response, callback);
  };
}

function parseXMLAsync(response, callback){
  parseString(response, function (err, result) {
    //console.log(result);
    callback(null, result);
  });
}

module.exports.list = function * list(next) {
  if ('GET' != this.method) return yield next;
  var options = {
    url: 'http://132.217.140.31:8080/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0'
  };
  var response = yield request(options); //Yay, HTTP requests with no callbacks!
  this.body = yield parseXMLThunk(response.body);
};

