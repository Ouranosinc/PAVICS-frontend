'use strict';
import config from '../../config'
import { parseString } from 'xml2js'
import request from 'koa-request'
import url from 'url'

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
  let query = `${config.pavics_solr_path}/wps?service=WPS&version=1.0.0&request=Execute&identifier=esgsearch&DataInputs=url=http://pcmdi.llnl.gov/esg-search${constraints}`;
  console.log(`Querying: ${query}`)
  var optionsWPS = {
    url: query
  };
  let responseWPS = yield request(optionsWPS);
  let xmlToJson = yield parseXMLThunk(responseWPS.body)
  let wpsOutput = extractWPSOutputPath(xmlToJson);
  if(wpsOutput.length){
    var optionsJson = {
      url: wpsOutput
    };
    let responseJson = yield request(optionsJson);
    let datasets = JSON.parse(responseJson.body);
    this.body = datasets.sort(function(a, b){
      if (a.id < b.id)
        return -1;
      if (a.id >  b.id)
        return 1;
      return 0;
    });
  }else{
    this.body = [];
  }
};

function getServicesFromXmlCatalog(catalogJson, query){
  let services = [];
  var parsedUrl  = url.parse(query);
  catalogJson.catalog.service.forEach(function(service){
    if(service.$.serviceType === "Compound"){
      service.service.forEach(function(service){
        services.push({
          type: service.$.serviceType,
          baseUrl: `${ (service.$.base.includes('//') || service.$.base.includes('globus:')) ? "" : `${parsedUrl.protocol}//${parsedUrl.host}` }${service.$.base}`
        })
      });
    }else{
      services.push({
        type: service.$.serviceType,
        baseUrl: `${ (service.$.base.includes('//') || service.$.base.includes('globus:')) ? "" : `${parsedUrl.protocol}//${parsedUrl.host}` }${service.$.base}`
      })
    }
  });
  //TODO: WMS SERVICE IS HARDCODED AT THIS POINT
  services.push({
    type: "WMS",
    baseUrl: "http://132.217.140.31:8080"
  });
  return services;
}

function getMetadataFromXmlCatalog(catalogJson){
  let metadatas = [];
  catalogJson.catalog.dataset[0].property.forEach(function(metadata){
    metadatas.push({
      key: metadata.$.name,
      value: metadata.$.value
    })
  });
  return metadatas;
}

function getDatasetsFromXmlCatalog(catalogJson, baseServices){
  let datasets = [];
  catalogJson.catalog.dataset[0].dataset.forEach(function(dataset){
    //TODO We should loop recursively in dataset, that's actually why dataSize and serviceName do not exists!
    //TODO: We now completely ignore those third level datasets
    if(!dataset.dataset) {
      let metadatas = [];
      let size = (dataset.dataSize)?`${ dataset.dataSize[0]._ }${ dataset.dataSize[0].$.units }`:""; //TOFIX
      let name = dataset.$.name;
      let id = dataset.$.id;
      let services = [];
      let mainServiceType = (dataset.serviceName)?dataset.serviceName[0]:""; //TOFIX
      let mainService = baseServices.find(x => x.type === mainServiceType);
      if(mainService){ //TOFIX
        services.push({
          type: dataset.serviceName[0],
          url: mainService.baseUrl + dataset.$.urlPath
        });
      }
      //TODO: WMS SERVICE IS HARDCODED AT THIS POINT
      services.push({
        type: "WMS",
        url: baseServices.find(x => x.type === "WMS").baseUrl + "/ncWMS2/wms"
      });
      if(dataset.access){
        dataset.access.forEach(function (access) {
          let base = baseServices.find(x => access.$.serviceName.includes(x.type)); //Alternatives to get OpenDAPServer === OpenDAP
          if (base) {
            services.push({
              type: base.type,
              url: base.baseUrl + access.$.urlPath
            });
          }
        });
      }
      if(dataset.property){
        dataset.property.forEach(function (metadata) {
          metadatas.push({
            key: metadata.$.name,
            value: metadata.$.value
          })
        });
      }
      datasets.push({
        metadatas: metadatas,
        size: size,
        name: name,
        id: id,
        services: services
      })
    }
  });
  return datasets;
}

function extractDatasetFromXmlCatalog(catalogJson, query){
  let services = getServicesFromXmlCatalog(catalogJson, query);
  //Sort by type
  services = services.sort(function(a, b){
    if (a.type < b.type)
      return -1;
    if (a.type >  b.type)
      return 1;
    return 0;
  });
  let metadatas = getMetadataFromXmlCatalog(catalogJson);
  //Sort by key
  metadatas = metadatas.sort(function(a, b){
    if (a.key < b.key)
      return -1;
    if (a.key >  b.key)
      return 1;
    return 0;
  });
  let datasets = getDatasetsFromXmlCatalog(catalogJson, services);
  //Sort by name
  datasets = datasets.sort(function(a, b){
    if (a.name < b.name)
      return -1;
    if (a.name >  b.name)
      return 1;
    return 0;
  });
  return {
    name: catalogJson.catalog.dataset[0].$.name,
    id: catalogJson.catalog.dataset[0].$.ID,
    service: services,
    metadatas: metadatas,
    datasets: datasets
  };
}

module.exports.getDataset = function * list(next) {
  if ('GET' != this.method) return yield next;
  let query = this.request.query.url;
  if (query.length){
    console.log("Found url: " + query);
    let responseWPS = yield request(query);
    let xmlToJson = yield parseXMLThunk(responseWPS.body);
    let dataset = extractDatasetFromXmlCatalog(xmlToJson, query);
    this.body = dataset;
  }else{
    this.body = {};
  }
};
