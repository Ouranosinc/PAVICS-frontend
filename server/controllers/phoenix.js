import config from '../../config';
import request from 'koa-request';
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
          options = {
            url: config.pavics_phoenix_path + '/monitor?limit=1000',
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
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
