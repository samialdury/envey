PROJECT_NAME	:= create-npm-library

NPM_BIN				:= ./node_modules/.bin

TSC						:= $(NPM_BIN)/tsc
TSUP					:= $(NPM_BIN)/tsup
VITEST				:= $(NPM_BIN)/vitest
PRETTIER			:= $(NPM_BIN)/prettier
ESLINT				:= $(NPM_BIN)/eslint
HUSKY					:= $(NPM_BIN)/husky
CHANGESET 		:= $(NPM_BIN)/changeset

.PHONY: help
## Display this help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## install all dependencies
	pnpm install
	$(HUSKY) install

##@ Build

.PHONY: build
build: ## build TS
	$(TSC) --build --force

.PHONY: bundle
bundle: ## bundle
	$(TSUP) src/index.ts --format cjs,esm --dts

##@ Versioning

.PHONY: version
version: ## bump version
	$(CHANGESET) add

.PHONY: release
release: bundle ## bundle and publish
	$(CHANGESET) publish

##@ Test

.PHONY: test
test: ## run tests
	$(VITEST) run

.PHONY: test-watch
test-watch: ## run tests (watch mode)
	$(VITEST) watch

.PHONY: test-coverage
test-coverage: ## run tests (with coverage)
	$(VITEST) run --coverage

##@ Code quality

.PHONY: prettier
prettier: ## run Prettier (autofix)
	$(PRETTIER) --cache --write .

.PHONY: eslint
eslint: ## run ESLint (autofix)
	$(ESLINT) --max-warnings 0 --cache --fix .

.PHONY: lint
lint: prettier eslint ## run Prettier & ESlint (autofix)

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: ## build TS (CI)
	$(TSC) --build --force

.PHONY: test-ci
test-ci: test-coverage ## run tests (CI)

.PHONY: prettier-ci
prettier-ci: ## run Prettier (CI)
	$(PRETTIER) --check .

.PHONY: eslint-ci
eslint-ci: ## run ESLint (CI)
	$(ESLINT) --max-warnings 0 .

.PHONY: lint-ci
lint-ci: prettier-ci eslint-ci ## run Prettier & ESlint (CI)
