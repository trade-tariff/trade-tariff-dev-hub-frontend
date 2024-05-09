.PHONY: default build run clean

IMAGE_NAME := trade-tariff-dev-hub-frontend
SHELL := /usr/bin/env bash

run: clean build
	source .env.development && yarn run start

test:
	yarn run test && yarn run lint

clean:
	yarn run clean

source:
	source .env.development

build:
	yarn run build

docker-configure:
	cp .env.development .env.development.local
	sed -i'' -e 's/^export //' .env.development.local

docker-build:
	docker build -t $(IMAGE_NAME) .

docker-run: docker-configure
	docker run \
		--network=host \
		--rm \
		--name $(IMAGE_NAME) \
		-e DEBUG=express:* \
		-e NODE_ENV=test \
		--env-file .env.development.local \
		-it \
		$(IMAGE_NAME) \

docker-clean:
	docker rmi $(IMAGE_NAME)
	rm .env.development.local

docker-shell:
	docker run \
		--rm \
		--name $(IMAGE_NAME)-shell \
		--no-healthcheck \
		-it $(IMAGE_NAME) /bin/sh
