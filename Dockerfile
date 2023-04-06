# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
COPY --chown=hmcts:hmcts . .
RUN apk --no-cache add git
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build
RUN apk --no-cache add git
RUN yarn install

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
EXPOSE 3000


