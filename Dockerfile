# ---- Dependencies image ----
FROM node:8.12.0-stretch as base
ENV WORKDIR=/opt/app \
    APP_USER=hmcts
WORKDIR ${WORKDIR}
EXPOSE 3000

# Create the non-root user
RUN addgroup --system --gid 1001 $APP_USER \
    && adduser --system --gid 1001 -uid 1001 --disabled-password --disabled-login $APP_USER \
    && chown -R $APP_USER:$APP_USER $WORKDIR

COPY package.json yarn.lock ./
RUN yarn install \
    --production \
    --ignore-scripts \
    && yarn cache clean

# ---- Runtime imge ----
FROM base as runtime
COPY . .

# Run process with non-root user
USER $APP_USER
CMD [ "yarn", "start" ]
