'use strict';

const querystring = require('querystring');
const multiparty = require('multiparty');

const raw = req => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  return new Promise(resolve =>
    req.on('end', () => {
      const data = Buffer.concat(chunks);
      resolve({ data });
    })
  );
};

const multipart = req => {
  const form = new multiparty.Form();
  return new Promise((resolve, reject) =>
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    })
  );
};

const json = async req => {
  const { data } = await raw(req);
  const body = JSON.parse(data);
  return { data, body };
};

const urlencoded = async req => {
  const { data } = await raw(req);
  const body = querystring.parse(data);
  return { data, body };
};

const parse = req => {
  const contentType = this.headers['content-type'];

  if (!contentType) {
    return raw(req);
  }

  if (contentType.startsWith('multipart/form-data')) {
    return multipart(req);
  } else if (contentType.startsWith('application/json')) {
    return json(req);
  } else if (contentType.includes('urlencoded')) {
    return urlencoded(req);
  }

  return raw(req);
};

module.exports = parse;
