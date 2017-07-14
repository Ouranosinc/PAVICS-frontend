import config from '../../config';
import request from 'koa-request';
import Utils from './../Utils';

let phoenix = (() => {
  return {
    consume: function * () {
      let options;
      let response;
      let process;
      switch (this.params.identifier) {
        case 'inputs':
          let provider = this.request.query.provider;
          process = this.request.query.process;
          options = {
            url: `${config.pavics_phoenix_path}/processes/execute?wps=${provider}&process=${process}`,
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
          break;
        case 'jobs' :
          let limit = this.request.query.limit;
          let page = this.request.query.page;
          let sort = this.request.query.sort;
          // WTF is going on with the Phoenix pagination?
          options = {
            url: config.pavics_phoenix_path + `/monitor?limit=99999`, // ${limit}&page=${page}&sort=${sort}`,
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          let json = JSON.parse(response.body);
          // Workaround because phoenix pagination suck and is unpredictable
          let start = (page - 1) * limit;
          let paginatedJobs = json.jobs.slice(start, start + limit);
          for (let i = 0; i < paginatedJobs.length; ++i) {
            paginatedJobs[i]['response_to_json'] = yield Utils.parseXMLThunk(paginatedJobs[i]['response']);
            paginatedJobs[i]['request_to_json'] = yield Utils.parseXMLThunk(paginatedJobs[i]['request']);
          }
          json.jobs = paginatedJobs;
          this.body = json;
          break;
        case 'jobsCount' :
          options = {
            url: config.pavics_phoenix_path + `/monitor?limit=99999`, // phoenix needs a limit, else it's 10 by default
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          let parsed = JSON.parse(response.body);
          this.body = { count: parsed.jobs.length };
          break;
        case 'processes' :
          options = {
            url: config.pavics_phoenix_path + '/processes',
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
          break;
        case 'processesList' :
          options = {
            url: config.pavics_phoenix_path + '/processes/list?wps=' + this.request.query.provider,
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
          break;
        case 'execute':
          console.log('query:', this.request.query);
          let wps = this.request.query.wps;
          process = this.request.query.process;
          let inputs = this.request.query.inputs.split(';');
          let data = {
            submit: 'submit'
          };
          inputs.map(inputString => {
            let input = inputString.split('=');
            let key = input[0];
            if (key === 'resource') {
              data[key] = [input[1]];
            } else {
              data[key] = input[1];
            }
          });
          console.log('data:', data);
          options = {
            method: 'POST',
            headers: {
              Authorization: 'Basic UGhvZW5peDpQNHYxY3M=',
              'Content-Type': 'multipart/form-data',
              accept: 'text/html'
            },
            url: `https://outarde.crim.ca:8443/processes/execute?wps=${wps}&process=${process}`,
            form: data,
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
          break;
      }
    }
  };
})();
export default phoenix;
