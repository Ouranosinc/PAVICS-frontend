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
          let projectId = parseInt(this.request.query.projectId, 10);
          let limit = parseInt(this.request.query.limit, 10);
          let page = parseInt(this.request.query.page, 10);
          let sort = this.request.query.sort;
          // WTF is going on with the Phoenix pagination?
          options = {
            url: config.pavics_phoenix_path + `/monitor?limit=99999`, // ${limit}&page=${page}&sort=${sort}`,
            headers: {
              // Cookie: "phoenix_session=687473a9e273b666aa3e310341fbb86df41ceedbbffc637c3dd6493badbf26256efa4f3e",
              Accept: 'application/json'
            },
            rejectUnauthorized: false
          };
          response = yield request(options);
          let json = JSON.parse(response.body);

          // Fetch loopback jobs for this project
          let filter = JSON.stringify({where: {projectId: projectId}});
          let loopbackResponse = yield request(`${config.loopback_api_path}/Jobs?filter=${filter}`);
          let lbProjectJobs = JSON.parse(loopbackResponse.body);
          // console.log(JSON.parse(loopbackResponse.body));

          // Filter phoenix returned job with loopback results
          let filteredJobs = json.jobs.filter( (job) => lbProjectJobs.find((lbJob) => lbJob.phoenixTaskId === job.task_id));
          // console.log(filteredJobs.length);

          // Custom pagination because phoenix pagination suck and is unpredictable
          // And we need loopback project filtering anyway ...
          let start = (page - 1) * limit;
          let paginatedJobs = filteredJobs.slice(start, start + limit);
          for (let i = 0; i < paginatedJobs.length; ++i) {
            paginatedJobs[i]['response_to_json'] = yield Utils.parseXMLThunk(paginatedJobs[i]['response']);
            paginatedJobs[i]['request_to_json'] = yield Utils.parseXMLThunk(paginatedJobs[i]['request']);
          }

          // Over-writting phoenix values return with what interests us
          let result = {};
          result.count = filteredJobs.length;
          result.jobs = paginatedJobs;
          this.body = result;
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
