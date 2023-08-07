COMMIT_SHA := $(shell git rev-parse --short HEAD)
PROJECT_NAME := $(shell basename "$(PWD)")

BIN := node_modules/.bin

SRC_DIR := src
BUILD_DIR := dist
CACHE_DIR := .cache

.PHONY: help
## Display this help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## install all dependencies
	@pnpm install
	@$(BIN)/husky install

.PHONY: typecheck
typecheck: ## compile TS (no emit)
	@$(BIN)/tsc --noEmit

##@ Build

.PHONY: build
build: ## build the project
	@rm -rf $(BUILD_DIR)
	@$(BIN)/tsup

##@ Test

.PHONY: test
test: ## run tests
	@$(BIN)/vitest run

.PHONY: test-watch
test-watch: ## run tests and watch for changes
	@$(BIN)/vitest watch

.PHONY: test-coverage
test-coverage: ## run tests and generate coverage report
	@$(BIN)/vitest run --coverage

##@ Code quality

.PHONY: format
format: ## format the code
	@$(BIN)/prettier --cache --cache-location=$(CACHE_DIR)/prettier --write .

.PHONY: lint
lint: ## lint the code
	@$(BIN)/eslint --max-warnings 0 --cache --cache-location $(CACHE_DIR)/eslint --fix .

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	@pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: build ## build the project (CI)

.PHONY: test-ci
test-ci: test ## run tests (CI)

.PHONY: format-ci
format-ci: ## format the code (CI)
	@$(BIN)/prettier --check .

.PHONY: lint-ci
lint-ci: ## lint the code (CI)
	@$(BIN)/eslint --max-warnings 0 .

##@ Release

.PHONY: release
release: ## create a new release
	@$(BIN)/semantic-release
