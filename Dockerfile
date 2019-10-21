# ---- Dependencies image ----
FROM hmctspublic.azurecr.io/base/node/alpine-lts-10:10-alpine as base
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
