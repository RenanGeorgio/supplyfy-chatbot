FROM node:21.7.3-alpine3.19 AS build 
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apk add --no-cache --virtual .gyp python3 make g++
RUN yarn install --no-lockfile
RUN yarn run build
RUN apk del .gyp

FROM node:21.7.3-alpine3.19 AS prod
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY tsconfig.json /usr/src/app/
COPY declarations.d.ts /usr/src/app/
RUN apk add --no-cache --virtual .gyp python3 make g++
RUN yarn install --production --no-lockfile
RUN apk del .gyp

FROM node:21.7.3-alpine3.19 AS run
EXPOSE 8000
RUN apk add dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node --from=prod /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node package.json /usr/src/app/
COPY --chown=node:node tsconfig.json /usr/src/app/
COPY --chown=node:node declarations.d.ts /usr/src/app/
CMD ["dumb-init", "yarn", "run", "prod"]