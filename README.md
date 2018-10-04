# Divorce Respondent Frontend
A starting point for all new divorce frontend projects.

It includes common services, middleware and configs

## Getting started

`yarn install`

`touch docker-compose.yaml`

put the following into docker-compose.yaml file:

```
redis:
  image: redis
  ports:
    - "6379:6379"
```

Start database:

`docker-compose up`

Start application and required mocks:

`yarn dev`

`yarn mocks`

Running tests:

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