const fetch = require('isomorphic-fetch');

const myHttp = ((fetch) => {
  return {
    get: (url) => {
      const headers = new Headers();
      const init = {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      };
      return fetch(url, init);
    },
    postJson: (url, data) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const request = new Request(
        url,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: headers,
          credentials: 'include',
        }
      );
      return fetch(request);
    },
    postFormData: (url, data) => {
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
          headers: headers,
        }
      );
      return new Promise((resolve, reject) => {
        fetch(request)
          .then(res => {
            console.log('fetch resolved: %o', res);
            resolve(res);
          })
          .catch(err => {
            console.log('fetch rejected!: %o', err);
            reject(err);
          });
      });
    },
  };
})(fetch);

export default myHttp;
