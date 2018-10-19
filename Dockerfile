FROM node:8.12.0-slim

RUN apt-get update && \
        apt-get install -y git && \
        apt-get clean

WORKDIR /opt/app

ARG NODE_ENV=production
ARG GIT_REVISION

ENV GIT_REVISION=$GIT_REVISION \
    NODE_ENV=$NODE_ENV

COPY . /opt/app
RUN yarn && yarn setup && yarn cache clean

CMD [ "yarn", "start" ]

EXPOSE 3000
