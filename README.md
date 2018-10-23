# Divorce Respondent Frontend
A starting point for all new divorce frontend projects.

It includes common services, middleware and configs

## Getting started

### Running via Docker

This option lets you start up the service without any local dependencies other than Docker

`docker-compose up`

### Dev setup

For development, use this option to have better control and debugging

`yarn install`

Start database:

`docker run -p 6379:6379 -d redis`

Start application and required mocks:

`yarn dev`

`yarn mocks`

## Running tests:

* Unit

```
yarn test:unit
```

* Validation

```
yarn test:validation
```

* E2E

Run the following, each in a separate terminal window
```
yarn dev
yarn mocks
yarn test:e2e
```