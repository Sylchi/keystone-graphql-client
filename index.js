import * as FormData from 'form-data'

let API_URL = process.env.GRAPHQL_API_URL || '/admin/api';
let options = {
  method: 'POST',
  credentials: 'include',
  headers: {}
}

export const query = async queryOptions => {
  const clonedOptions = JSON.parse(JSON.stringify(options));
  if(!clonedOptions.headers) clonedOptions.headers = {};
  clonedOptions.headers['Content-type'] = 'application/json';
  clonedOptions.body = JSON.stringify(queryOptions);
  return fetch(API_URL, clonedOptions).then(res => res.json());
}

export const mutate = async mutationOptions => {
  const body = new FormData();
  
  mutationOptions.query = mutationOptions.mutation;
  delete mutationOptions.mutation;

  body.append("operations", JSON.stringify(mutationOptions));

  const map = {};

  if(mutationOptions.variables && mutationOptions.variables.data){
    let index = 1;
    for(const [key, value] of Object.entries(mutationOptions.variables.data)){
      if(!!value && (value.constructor === File || value.constructor === Blob)){
        map[index] = [`variables.data.${key}`];
        index++;
      }
    } 
  }

  body.append("map", JSON.stringify(map));

  for(const [key, value] of Object.entries(map)){
    const name = value[0].split('.').pop();
    body.append(key, mutationOptions.variables.data[name]);
    delete mutationOptions.variables.data[name];
  }
  const clonedOptions = JSON.parse(JSON.stringify(options));
  if(clonedOptions.headers && clonedOptions.headers['Content-type']) delete clonedOptions.headers['Content-type'];
  return fetch(API_URL, { ...clonedOptions, body }).then(res => res.json());
}

export default (url, opts) => {
  if(url) API_URL = url;
  if(opts) options = opts;
  return { query, mutate }
}

