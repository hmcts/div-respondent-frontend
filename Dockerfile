# ---- Dependencies image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn cache clean
RUN apt-get -y update
RUN apt-get -y install git
RUN echo "apt-get -y install git"
RUN yarn install

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
