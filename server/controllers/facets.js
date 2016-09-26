'use strict';
import config from '../../config'
import { parseString } from 'xml2js'
import request from 'koa-request'

//Explanation here http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/
// leaving this here for posterity
function parseXMLThunk(response){
  //console.log(response);
  return function(callback) {
    parseXMLAsync(response, callback);
  };
}

// leaving this here for posterity
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
  let url = config.pavics_wpsconsumer_search_path + "?facets=*&limit=0&distrib=false";
  let response = yield request(url); //Yay, HTTP requests with no callbacks!
  let json = JSON.parse(response.body);
  response = [];
  json["responseHeader"]["params"]["facet.field"].forEach(function(key){
    response.push({
      key: key,
      values: []
    })
  });
  var facetFields = json["facet_counts"]["facet_fields"];
  for (var object in facetFields){
    if (facetFields.hasOwnProperty(object)) {
      let values = [];
      let index = response.findIndex( x => x.key === object );
      for (var value in facetFields[object]) {
        if (facetFields[object].hasOwnProperty(value)) {
          var thisValue = facetFields[object][value];
          if (thisValue === 0 || thisValue === "0") {
            continue;
          }
          values.push(thisValue);
        }
      }
      values.sort();
      response[index].values = values
    }
  }
  this.body = response;
};

