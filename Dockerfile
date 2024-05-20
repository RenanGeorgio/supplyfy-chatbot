FROM node:22.0.0-alpine3.19 AS build
ARG ARG_MONGO_URL
ENV MONGO_URL $ARG_MONGO_URL
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apk add --no-cache --virtual .gyp python3 make g++ git
RUN yarn install && yarn cache clean
RUN yarn run build
RUN apk del .gyp

FROM node:22.0.0-alpine3.19 AS run
ARG ARG_MONGO_URL
ENV MONGO_URL $ARG_MONGO_URL
EXPOSE 8000
RUN apk add dumb-init git
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node package.json /usr/src/app/
COPY --chown=node:node tsconfig.json /usr/src/app/
COPY --chown=node:node declarations.d.ts /usr/src/app/
RUN yarn install --production && yarn cache clean
USER node
CMD ["dumb-init", "yarn", "run", "prod"]