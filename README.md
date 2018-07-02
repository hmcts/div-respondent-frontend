# Divorce Frontend boilerplate
A starting point for all new divorce frontend projects.

It includes common services, middleware and configs

## Fork this boilerplate

To create a new application fork this repo
https://help.github.com/articles/fork-a-repo/

## Sync with this boilerplate

To sync with the latest changes
https://help.github.com/articles/syncing-a-fork/

## Getting the app running on CNP
- Change package name description
- Change product component name ( currently "bfe" ) in following files
  div-frontend-boilerplate/infrastructure/main.tf
  div-frontend-boilerplate/infrastructure/variables.tf
  div-frontend-boilerplate/Jenkinsfile_CNP
- Permissions added on CNP side to allow it to build

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

Start application:

`yarn dev`
