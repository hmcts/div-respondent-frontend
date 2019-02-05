# ---- Dependencies image ----
FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8:latest as base
RUN apt-get update && apt-get install -y bzip2 git
COPY package.json yarn.lock ./
RUN yarn install --production \
    # Specific to this app as static dependencies
    # are generated at runtime
    && chown -R hmcts:hmcts $WORKDIR/node_modules

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
# Run process with non-root user
USER hmcts
