import config from '../../config';
import Utils from './../Utils';
import myHttp from './../../lib/http';

let phoenix = (() => {
  return {
    consume: function * () {
      let response;
      let process;
      switch (this.params.identifier) {
        case 'inputs':
          const provider = this.request.query.provider;
          process = this.request.query.process;
          response = yield myHttp.get(
            `${config.pavics_phoenix_path}/processes/execute?wps=${provider}&process=${process}`,
            {Accept: 'application/json'}
          );
          this.body = response.body;
          break;
        case 'jobs' :
          const projectId = parseInt(this.request.query.projectId, 10);
          const limit = parseInt(this.request.query.limit, 10);
          const page = parseInt(this.request.query.page, 10);
          // WTF is going on with the Phoenix pagination?
          // const sort = this.request.query.sort;
          // ${limit}&page=${page}&sort=${sort}`,
          response = yield myHttp.get(`${config.pavics_phoenix_path}/monitor?limit=99999`, {Accept: 'application/json'});
          let json = JSON.parse(response.body);

          // Fetch loopback jobs for this project
          let filter = JSON.stringify({where: {projectId: projectId}});
          let loopbackResponse = yield myHttp.get(`${config.loopback_api_path}/Jobs?filter=${filter}`);
          let lbProjectJobs = JSON.parse(loopbackResponse.body);
          // console.log(JSON.parse(loopbackResponse.body));

          // Filter phoenix returned job with loopback results
          let filteredJobs = json.jobs.filter(job => lbProjectJobs.find((lbJob) => lbJob.phoenixTaskId === job.task_id));
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
          // TODO once everything is behind same domain, that call can be directly made from frontend instead of extra roundtrip in koa
          response = yield myHttp.get(`${config.pavics_phoenix_path}/processes`, {Accept: 'application/json'});
          this.body = response.body;
          break;
        case 'processesList' :
          // TODO once everything is behind same domain, that call can be directly made from frontend instead of extra roundtrip in koa
          response = yield myHttp.get(`${config.pavics_phoenix_path}/processes/list?wps=${this.request.query.provider}`, {Accept: 'application/json'});
          this.body = response.body;
          break;
      }
    }
  };
})();
export default phoenix;
