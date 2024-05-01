.PHONY: default build run clean

SHELL := /usr/bin/env bash

run: clean build
	source .env.development && yarn run start

test:
	yarn run test

clean:
	yarn run clean

source:
	source .env.development

build:
	yarn run build
