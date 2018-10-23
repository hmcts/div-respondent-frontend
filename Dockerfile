FROM node:8.12.0-slim

RUN apt-get update && \
        apt-get install -y git && \
        apt-get clean

WORKDIR /opt/app

COPY . /opt/app
RUN yarn --production && yarn setup && yarn cache clean

CMD [ "yarn", "start" ]

EXPOSE 3000
