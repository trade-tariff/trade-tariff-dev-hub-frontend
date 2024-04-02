FROM node:21-alpine3.18
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app

RUN yarn run build

ENV PORT=8080 \
  NODE_ENV=production

USER tariff

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
