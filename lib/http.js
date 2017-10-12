const fetch = require('isomorphic-fetch');

const myHttp = ((fetch) => {
  const appendHeadersFromObject = (object, headers) => {
    for (let prop in object) {
      if (object.hasOwnProperty(prop)) {
        headers.append(prop, object[prop]);
      }
    }
  };
  return {
    get: (url, optionalHeaders) => {
      let headers = new Headers();
      appendHeadersFromObject(optionalHeaders, headers);
      const init = {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      };
      return fetch(url, init);
    },
    postJson: (url, data, optionalHeaders) => {
      let headers = new Headers();
      appendHeadersFromObject(optionalHeaders, headers);
      headers.append('Content-Type', 'application/json');
      const request = new Request(
        url,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: headers,
          credentials: 'include'
        }
      );
      return fetch(request);
    },
    postUrlEncodedForm: (url, data) => {
      let str = [];
      Object.keys(data).map(key => str.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key])));
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      const request = new Request(
        url,
        {
          method: 'POST',
          body: str.join('&'),
          credentials: 'include',
          headers: headers
        }
      );
      return fetch(request);
    },
    postFormData: (url, formData, optionalHeaders) => {
      let headers = new Headers();
      appendHeadersFromObject(optionalHeaders, headers);
      const request = new Request(
        url,
        {
          method: 'POST',
          body: formData,
          headers: headers,
          credentials: 'include'
        }
      );
      return fetch(request);
    }
  };
})(fetch);

export default myHttp;
