import config from '../../config';
import request from 'koa-request';
let phoenix = (() => {
  return {
    consume: function * () {
      let options;
      let response;
      switch (this.params.identifier) {
        case 'processes' :
          options = {
            url: config.pavics_phoenix_path + '/processes/list?wps=flying',
            headers: {
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          this.body = response.body;
          break;
        case 'execute':
          options = {
            method: 'POST',
            headers: {
              Authorization: 'Basic UGhvZW5peDpxd2VydHk=',
              'Content-Type': 'multipart/form-data',
              accept: 'text/html'
            },
            url: 'https://outarde.crim.ca:8443/processes/execute?wps=emu_&process=helloworld',
            form: {
              user: 'phoenix consumer form data',
              submit: 'submit'
            },
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
