# keystone-graphql-client

A simple graphql fetch client for frontent clients to access keystone.js based backend. Automatic file upload support included.


## Reason for existence

1) At the time of creation apollo graphql client was taking 73kb! of the 282.13kb gzipped bundle for my app.
2) When I got started with keystone.js then getting file upload to work was not as straight forward as I would have liked. 

## Installation

    npm install @sylchi/keystone-graphql-client

or

    yarn add @sylchi/keystone-graphql-client

## Usage

For convinience it will take the API url from a GRAPHQL_API_URL enviroment variable. If that is set its just as simple as importing it and using it right away as you would use apollo client.

Query:

    import { query } from  '@sylchi/keystone-graphql-client'
	
	const options = {
		query: `
			query($sortBy: [SortUsersBy!]){
			  allUsers(sortBy: $sortBy){
			    id
			  }
			}
		`,
		variables: {
			sortBy: 'id_ASC'
		}
	}
	
	query(options).then(result => console.log(result))

Mutation

    import {  mutate } from  '@sylchi/keystone-graphql-client'

	const  getFile  = () =>  fetch('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
	{
		mode:  "cors",
		cache:  "no-cache"
	})
	.then(response  =>  response.blob())
	.then(blob  => {
		return  new  File([blob], "file.png", { type:  "image/png" })
	});

	getFile().then(file  => {

	const  options  = {
		mutation: `
			mutation($id: ID!, $data: UserUpdateInput!){
				updateUser(id: $id, data: $data){
					id
				}
			}
		`,
		variables: {
			id:  "5f5a7f712a64d9db72b30602", //replace with user id
			data: {
				avatar:  file
			}
		}
	}
	
	mutate(options).then(result  =>  console.log(result));
	
	});




## Configuration

This package takes 2 arguments for configuration, both are optional. In this example we have 2 different endpoints for authenticated users and normal users. If API url is not set and environment variable `GRAPHQL_API_URL` is not set the url defaults to `/admin/api`.
By default `credentials` fiels is set to `include`.

  	//can have any name
	import GraphQlClient from '@sylchi/keystone-graphql-client';
	
	const apiUrl = 'www.example.com';
	const authedUrl = 'authed.example.com';
	const fetchOptions  = {
		credentials:  'omit',
		method: 'POST',
		headers: {
			'x-user-lang':  'english'
		}
	}
	const fetchOptionsAuthed = {
		credentials:  'include',
		method: 'POST',
		headers: {
			'x-user-token':  '***********'
		}
	}
	const { query, mutate } =  GraphQlClient(apiUrl, fetchOptions);
	const { query: authedQuery, mutate: authedMutate } = GraphQlClient(authedUrl, fetchOptionsAuthed);
	

## Caveats

This package does not handle caching of requests

## Other

Pull requests are welcome