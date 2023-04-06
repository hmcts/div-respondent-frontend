# ---- Dependencies image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn cache clean
RUN yarn install

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
