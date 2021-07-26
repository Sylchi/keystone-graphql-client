const fetch = require('node-fetch');

let API_URL = process.env.GRAPHQL_API_URL || process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/admin/api';
let options = {
  method: 'POST',
  credentials: 'include',
  headers: {}
}

const query = async queryOptions => {
  const clonedOptions = JSON.parse(JSON.stringify(options));
  if(!clonedOptions.headers) clonedOptions.headers = {};
  clonedOptions.headers['Content-type'] = 'application/json';
  clonedOptions.body = JSON.stringify(queryOptions);
  return fetch(API_URL, clonedOptions).then(res => res.json());
}

const mutate = async mutationOptions => {
  const body = new FormData();
  
  mutationOptions.query = mutationOptions.mutation;
  delete mutationOptions.mutation;

  body.append("operations", JSON.stringify(mutationOptions));

  const map = {};
  let index = 0;
  const items = [];

  const mapData = (location, fileIndex) => {
    for(const [name, value] of Object.entries(location.data)){
      if(!!value && (value.constructor === File || value.constructor === Blob)){
        map[index] = [`variables.data${ !!fileIndex ? `.${fileIndex}.data.`: '.'}${name}`];
        items[index] = value;
        index++;
      }
    } 
  }

  if(mutationOptions.variables && mutationOptions.variables.data){
    if(Array.isArray(mutationOptions.variables.data)){
      for(const [fileIndex, entry] of Object.entries(mutationOptions.variables.data)){
        mapData(entry, fileIndex);
      }
    } else {
      mapData(mutationOptions.variables);
    }
  }

  body.append("map", JSON.stringify(map));

  for(const [key, value] of Object.entries(items)){
    body.append(key, value);
  }

  const clonedOptions = JSON.parse(JSON.stringify(options));
  if(clonedOptions.headers && clonedOptions.headers['Content-type']) delete clonedOptions.headers['Content-type'];
  return fetch(API_URL, { ...clonedOptions, body }).then(res => res.json());
}

const client = (url, opts) => {
  if(url) API_URL = url;
  if(opts) options = opts;
  return { query, mutate }
}

module.exports = { client, query, mutate }
