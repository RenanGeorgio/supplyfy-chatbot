FROM node:22.0.0-alpine3.19 AS build
ARG ARG_SESSION_TOKEN
ARG ARG_NODE_ENV
ARG ARG_USER_CONTROL
ARG ARG_FACEBOOK_METADATA
ARG ARG_APP_SECRET
ARG ARG_SERVER_URL
ARG ARG_ACCESS_TOKEN
ARG ARG_API_TOKEN_SECRET
ARG ARG_REDIS_PASSWORD
ARG ARG_REDIS_HOST
ARG ARG_REDIS_PORT
ARG ARG_KAFKA_BROKERS
ARG ARG_KAFKA_USERNAME
ARG ARG_KAFKA_PASSWORD
ARG ARG_MONGO_URL
ARG ARG_VERSION
ARG ARG_PHONE_NUMBER_ID
ARG ARG_WEBHOOK_VERIFICATION_TOKEN
ARG ARG_SFDC_CONSUMER_KEY
ARG ARG_SFDC_CONSUMER_SECRET
ARG ARG_SFDC_USERNAME
ARG ARG_SFDC_PASSWORD
ARG ARG_IGNAI_BOT
ARG ARG_AUTH0_ISSUER
ARG ARG_AUTH0_CLIENT_ID
ARG ARG_AUTH0_CLIENT_SECRET
ENV SESSION_TOKEN $ARG_SESSION_TOKEN
ENV NODE_ENV $ARG_NODE_ENV
ENV USER_CONTROL $ARG_USER_CONTROL
ENV FACEBOOK_METADATA $ARG_FACEBOOK_METADATA
ENV APP_SECRET $ARG_APP_SECRET
ENV SERVER_URL $ARG_SERVER_URL
ENV ACCESS_TOKEN $ARG_ACCESS_TOKEN
ENV API_TOKEN_SECRET $ARG_API_TOKEN_SECRET
ENV REDIS_PASSWORD $ARG_REDIS_PASSWORD
ENV REDIS_HOST $ARG_REDIS_HOST
ENV REDIS_PORT $ARG_REDIS_PORT
ENV KAFKA_BROKERS $ARG_KAFKA_BROKERS
ENV KAFKA_USERNAME $ARG_KAFKA_USERNAME
ENV KAFKA_PASSWORD $ARG_KAFKA_PASSWORD
ENV MONGO_URL $ARG_MONGO_URL
ENV VERSION $ARG_VERSION
ENV PHONE_NUMBER_ID $ARG_PHONE_NUMBER_ID
ENV WEBHOOK_VERIFICATION_TOKEN $ARG_WEBHOOK_VERIFICATION_TOKEN
ENV SFDC_CONSUMER_KEY $ARG_SFDC_CONSUMER_KEY
ENV SFDC_CONSUMER_SECRET $ARG_SFDC_CONSUMER_SECRET
ENV SFDC_USERNAME $ARG_SFDC_USERNAME
ENV SFDC_PASSWORD $ARG_SFDC_PASSWORD
ENV IGNAI_BOT $ARG_IGNAI_BOT
ENV AUTH0_ISSUER $ARG_AUTH0_ISSUER
ENV AUTH0_CLIENT_ID $ARG_AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_SECRET $ARG_AUTH0_CLIENT_SECRET
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apk add --no-cache --virtual .gyp python3 make g++ git
RUN yarn install && yarn cache clean
RUN yarn run build
RUN apk del .gyp

FROM node:22.0.0-alpine3.19 AS run
ARG ARG_SESSION_TOKEN
ARG ARG_NODE_ENV
ARG ARG_USER_CONTROL
ARG ARG_FACEBOOK_METADATA
ARG ARG_APP_SECRET
ARG ARG_SERVER_URL
ARG ARG_ACCESS_TOKEN
ARG ARG_API_TOKEN_SECRET
ARG ARG_REDIS_PASSWORD
ARG ARG_REDIS_HOST
ARG ARG_REDIS_PORT
ARG ARG_KAFKA_BROKERS
ARG ARG_KAFKA_USERNAME
ARG ARG_KAFKA_PASSWORD
ARG ARG_MONGO_URL
ARG ARG_VERSION
ARG ARG_PHONE_NUMBER_ID
ARG ARG_WEBHOOK_VERIFICATION_TOKEN
ARG ARG_SFDC_CONSUMER_KEY
ARG ARG_SFDC_CONSUMER_SECRET
ARG ARG_SFDC_USERNAME
ARG ARG_SFDC_PASSWORD
ARG ARG_IGNAI_BOT
ARG ARG_AUTH0_ISSUER
ARG ARG_AUTH0_CLIENT_ID
ARG ARG_AUTH0_CLIENT_SECRET
ENV SESSION_TOKEN $ARG_SESSION_TOKEN
ENV NODE_ENV $ARG_NODE_ENV
ENV USER_CONTROL $ARG_USER_CONTROL
ENV FACEBOOK_METADATA $ARG_FACEBOOK_METADATA
ENV APP_SECRET $ARG_APP_SECRET
ENV SERVER_URL $ARG_SERVER_URL
ENV ACCESS_TOKEN $ARG_ACCESS_TOKEN
ENV API_TOKEN_SECRET $ARG_API_TOKEN_SECRET
ENV REDIS_PASSWORD $ARG_REDIS_PASSWORD
ENV REDIS_HOST $ARG_REDIS_HOST
ENV REDIS_PORT $ARG_REDIS_PORT
ENV KAFKA_BROKERS $ARG_KAFKA_BROKERS
ENV KAFKA_USERNAME $ARG_KAFKA_USERNAME
ENV KAFKA_PASSWORD $ARG_KAFKA_PASSWORD
ENV MONGO_URL $ARG_MONGO_URL
ENV VERSION $ARG_VERSION
ENV PHONE_NUMBER_ID $ARG_PHONE_NUMBER_ID
ENV WEBHOOK_VERIFICATION_TOKEN $ARG_WEBHOOK_VERIFICATION_TOKEN
ENV SFDC_CONSUMER_KEY $ARG_SFDC_CONSUMER_KEY
ENV SFDC_CONSUMER_SECRET $ARG_SFDC_CONSUMER_SECRET
ENV SFDC_USERNAME $ARG_SFDC_USERNAME
ENV SFDC_PASSWORD $ARG_SFDC_PASSWORD
ENV IGNAI_BOT $ARG_IGNAI_BOT
ENV AUTH0_ISSUER $ARG_AUTH0_ISSUER
ENV AUTH0_CLIENT_ID $ARG_AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_SECRET $ARG_AUTH0_CLIENT_SECRET
EXPOSE 8000
RUN apk add dumb-init git
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node package.json /usr/src/app/
COPY --chown=node:node tsconfig.json /usr/src/app/
COPY --chown=node:node declarations.d.ts /usr/src/app/
COPY --chown=node:node model.nlp /usr/src/app/
COPY --chown=node:node . .
RUN yarn install --production && yarn cache clean
USER node
CMD ["dumb-init", "yarn", "run", "prod"]