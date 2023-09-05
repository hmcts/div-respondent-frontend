# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base
USER root
RUN corepack enable
RUN apk add git
USER hmcts
COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn cache clean

# ---- Runtime image ----
FROM base as runtime
COPY . .
EXPOSE 3000
CMD ["yarn", "run", "start"]


