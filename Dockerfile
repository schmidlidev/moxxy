### Build container ###
FROM node:17-alpine as builder

COPY package.json package-lock.json ./
RUN npm install

COPY src src
COPY tsconfig.json ./
RUN npx tsc

### Distributed container ###
FROM node:17-alpine

WORKDIR /moxxy

COPY nodemon.json ./
COPY --from=builder package.json package-lock.json ./
RUN npm install --production

COPY --from=builder dist dist

CMD ["npm", "run", "start"]