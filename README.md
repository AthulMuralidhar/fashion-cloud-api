## prelims
- this is a Typescript + express + mongodb app
- linting is done by eslint
- environment variables are controlled by .env

## available scripts
```bash
npm run dev
```
This script uses ts-node-dev to run and start the server. The default is ``localhost:7000``. The script also recompiles when any changes are made to the root file at `src/index.ts`
```
npm run lint
```

runs the es-linter for the project. Also, pre-commit cleanup is provided by ``husky``

## route description

``
GET  /
``
get all documents by id

``
GET OR CREATE BY ID  /<:id>
``
gets a document by id if found or creates one. Console logs`cache miss` when created

``UPDATE BY ID /<:id>``
updates a document by id

`` DELETE BY ID /<:id>``
deletes a document by id. If successful returns a count of deleted documents

``DELETE ALL /``
delete all documents

``POST  / ``
creates a document. The post request body must contain
```json
{
  "username": "zzzzzz",
  "email": "test@tes.com",
  "extraInfo": "test at test dot com"
}
```
If existing documents is greater than the max documents from the env variable, then starts replacing the oldest document.


## env variables
`PORT`
controls the port of the app 

`DATABASE_URL`
controls the mongodb connection and db. The default db is `node-express-mongodb-server`

`ERASE_ON_INIT`
controls the seeding behaviour and reset of the db

`TTL_SECS`
determines the maximum time to live for the documents in the db server

`MAX_DOCS`
restricts the maximum allowed documents 

`SEED_DOCS`
controls the number of generated documents on restart
