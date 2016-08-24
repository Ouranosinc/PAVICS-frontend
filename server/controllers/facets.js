'use strict';
import config from '../../config'
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
    let response = [];
    result.response.lst[0].lst[0].arr[0].str.forEach(function(key){
      response.push({
        key: key,
        values: []
      })
    });
    response.sort(function(a, b){
      if (a.key < b.key)
        return -1;
      if (a.key > b.key)
        return 1;
      return 0;
    });
    result.response.lst[1].lst[1].lst.forEach(function(object){
      let values = [];
      let index = response.findIndex( x => x.key === object.$.name );
      if(object.int){
        object.int.forEach(function(value){
          values.push(value.$.name);
        });
        values.sort();
      }
      response[index].values = values
    });
    callback(null, response);
  });
}

module.exports.getFacets = function * list(next) {
  if ('GET' != this.method) return yield next;
  var options = {
    url: config.pavics_esg_search_path + "?facets=*&limit=0&distrib=false"
  };
  var response = yield request(options); //Yay, HTTP requests with no callbacks!
  this.body = yield parseXMLThunk(response.body);
};

