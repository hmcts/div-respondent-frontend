# ---- Dependencies image ----
FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-10:10-stretch-slim as base
USER root
RUN apt-get update && apt-get install -y bzip2 git
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
