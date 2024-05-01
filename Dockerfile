FROM node:21-alpine3.18 AS builder
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn run build

FROM node:21-alpine3.18
WORKDIR /app

COPY REVISION package.json yarn.lock /app/
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist /app/dist

RUN addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app
USER tariff

ENV PORT=8080 \
  NODE_ENV=production

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
