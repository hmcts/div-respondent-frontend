# Divorce Respondent Frontend
A starting point for all new divorce frontend projects.

It includes common services, middleware and configs

## Getting started

### Dev setup

`yarn install`

Start database:

`docker run --name redis -p 6379:6379 -d redis`

Start application and required mocks:

`yarn dev`

`yarn mocks`

### Running tests:

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