const request       = require('request-promise');
const winston       = require('winston');

const Client = function client(config, customLogger) {
  const instanceConfig = (typeof config === 'object') ? config : {};

  instanceConfig.baseUrl = instanceConfig.baseUrl || process.env.EOKO_API_URL;

  this.logger  = customLogger || winston.loggers.add('eoko-client-api');
  this.config  = instanceConfig;

  if (!this.config.headers) {
    this.config.headers = {};
  }

  if (process.env.EOKO_API_KEY) {
    this.config.headers.apikey = instanceConfig.apiKey || process.env.EOKO_API_KEY;
  }

  if (process.env.EOKO_API_GROUPS) {
    this.config.headers['x-consumer-groups'] = instanceConfig.groups || process.env.EOKO_API_GROUPS;
  }
};

Client.prototype.get = function getRequest(path) {
  return this.request('GET', path)
             .catch(err => {
               this.logger.error(err);
               throw err;
             });
};

Client.prototype.post = function postRequest(path, body) {
  return this.request('POST', path, body)
             .catch(err => {
               this.logger.error(err);
               throw err;
             });
};

Client.prototype.delete = function deleteRequest(path) {
  return this.request('DELETE', path)
             .catch(err => {
               this.logger.error(err);
               throw err;
             });
};

Client.prototype.put = function putRequest(path, body) {
  return this.request('PUT', path, body)
             .catch(err => {
               this.logger.error(err);
               throw err;
             });
};

Client.prototype.patch = function patchRequest(path, partialBody) {
  return this.request('PATCH', path, partialBody)
             .catch(err => {
               this.logger.error(err);
               throw err;
             });
};

Client.prototype.request = function buildRequest(method, path, body) {
  const options = {
    method,
    uri: this.config.baseUrl + path,
    json: true,
    headers: this.config.headers,
  };

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options.body = body;
  }

  return request(options)
    .catch(err => {
      this.logger.error(err);
      throw err;
    });
};

module.exports = Client;
