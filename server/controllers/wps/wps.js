import request from 'koa-request'
import Utils from './../../Utils'
var wps = (function () {
  return {
    getClimateIndicators: function *() {
      // hardcoded for now until we know for sure where these capabilities will be coming from
      let response = yield request("http://132.217.140.31:8092/wps?service=WPS&version=1.0.0&request=DescribeProcess&identifier=cdo_operation");
      let json = yield Utils.parseXMLThunk(response.body);
      let inputs = json["wps:ProcessDescriptions"]["ProcessDescription"][0]["DataInputs"][0]["Input"];
      let allowedValues = inputs[1]["LiteralData"][0]["ows:AllowedValues"][0]["ows:Value"];
      this.body = allowedValues.map((x, i) => {
        return {key: i, value: x};
      });
    }
  };
})();
export default wps
