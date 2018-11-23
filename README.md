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

#### Running tests locally against a PR/AAT

* Rename `config/example-local-aat.yml` to `config/local-aat.yml` (which is ignored by git)

* Substitute any secret values in ***local-aat.yml*** from SCM - Do not add/commit secrets to the example file!

* If you want to point to a PR, modify `tests.e2e.url` accordingly.

* Run ```NODE_ENV=aat yarn test:functional```. This would your tests to pick up the new `local-aat.yml`.
