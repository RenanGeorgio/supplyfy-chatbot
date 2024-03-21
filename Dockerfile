FROM node:18.19.1-alpine AS build
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY tsconfig.json /usr/src/app/
RUN yarn install --production

FROM node:18.19.1-alpine AS run
EXPOSE 8000
RUN apk add dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["dumb-init", "node", "./dist/index.js"]