# trade-tariff-dev-hub-frontend

Express app enabling management of API credentials for FPO operators via a JSON api.

> Make sure you install and enable all pre-commit hooks https://pre-commit.com/

## App location

You can find the app running on the following URLs:

- https://hub.dev.trade-tariff.service.gov.uk/
- https://hub.staging.trade-tariff.service.gov.uk/
- https://hub.trade-tariff.service.gov.uk/

## Local development

### Prerequisites

- [nodejs]
- [yarn]

### Running the backend

Checkout the [backend repo] and follow the instructions in the README.md to run the backend.

### Starting the application

> Make sure you have started the backend

```sh
make run
```

### Running tests

```sh
make test
```

[yarn]: https://formulae.brew.sh/formula/yarn
[nodejs]: https://formulae.brew.sh/formula/node
[backend repo]: https://github.com/trade-tariff/trade-tariff-dev-hub-backend
