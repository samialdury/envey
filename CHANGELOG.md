## [2.6.3](https://github.com/samialdury/envey/compare/v2.6.2...v2.6.3) (2025-03-06)


### Bug Fixes

* release config ([c6ac555](https://github.com/samialdury/envey/commit/c6ac555715874c3c6b662003a667cc16d5c5e560))

## [2.6.2](https://github.com/samialdury/envey/compare/v2.6.1...v2.6.2) (2025-03-06)


### Bug Fixes

* release config ([c068911](https://github.com/samialdury/envey/commit/c06891153fceeff13ba6d8bfd493c9073e8867c8))

## [2.6.1](https://github.com/samialdury/envey/compare/v2.6.0...v2.6.1) (2025-03-06)

# [2.6.0](https://github.com/samialdury/envey/compare/v2.5.0...v2.6.0) (2025-03-05)


### Bug Fixes

* **no-release:** fix build cmd ([e5b0a01](https://github.com/samialdury/envey/commit/e5b0a01bfc3f38b2e4269f2ec57c17abe55a981a))
* **no-release:** remove wrong nodejs version from ci matrix ([56eaa84](https://github.com/samialdury/envey/commit/56eaa84db454b488f761dbfa65fa9fae188e1642))
* **no-release:** update pnpm build dependencies ([e65b784](https://github.com/samialdury/envey/commit/e65b784a2efdc5a8ed6de4cb0313dbe01f373c8c))


### Features

* **no-release:** update dev & release configs/setup ([c45435e](https://github.com/samialdury/envey/commit/c45435e2246fba3e783d4b310d2fcf0ae8699766))
* **no-release:** update packages ([e159de1](https://github.com/samialdury/envey/commit/e159de15aed07346bccc30e58d4d9b7eed62eecb))
* **no-release:** update vitest ([a4238d6](https://github.com/samialdury/envey/commit/a4238d67ca84f1bd00367ad83efd0026c01d3548))
* support nested schemas ([9ce5733](https://github.com/samialdury/envey/commit/9ce573363d8ab62ede28d63edfc4d3cd765895dc))

# [2.5.0](https://github.com/samialdury/envey/compare/v2.4.0...v2.5.0) (2025-01-27)


### Bug Fixes

* lint error ([7e21d70](https://github.com/samialdury/envey/commit/7e21d700392348f096a138c69338252e99930605))


### Features

* populate `env` key in error ([71cbedf](https://github.com/samialdury/envey/commit/71cbedf7590ad1446a5e02c4b8290b9678bd75aa))

# [2.4.0](https://github.com/samialdury/envey/compare/v2.3.0...v2.4.0) (2024-07-03)


### Bug Fixes

* **ci:** use pnpm 9 ([6466a0a](https://github.com/samialdury/envey/commit/6466a0a3ec95549c6ff3e2aa4daf2e9e8f793eb0))
* **ci:** use pnpm 9 ([dd22e3c](https://github.com/samialdury/envey/commit/dd22e3c3f156e58a41fb3f49b684854aa50506cd))
* **dependabot:** package ecosystem ([f6b4582](https://github.com/samialdury/envey/commit/f6b4582c92efc1b74fb17e488794d913ed390355))
* **docs:** typo in README example parameters ([#143](https://github.com/samialdury/envey/issues/143)) ([db2f731](https://github.com/samialdury/envey/commit/db2f731ea8c396df48911b0640bd617aae177653))


### Features

* enable dependabot ([b494aa3](https://github.com/samialdury/envey/commit/b494aa32abd781116fd35b5be168735f0e862310))
* pnpm 9 ([0567cf4](https://github.com/samialdury/envey/commit/0567cf42d158c9981635e00d1cac71ad07e0ffa6))
* publish to JSR ([9b4d635](https://github.com/samialdury/envey/commit/9b4d635f725ab30d8c8b1f780c4bc1b280a2a5c6))

# [2.3.0](https://github.com/samialdury/envey/compare/v2.2.1...v2.3.0) (2024-01-18)


### Features

* **ci:** add publint & attw ([0a11ad8](https://github.com/samialdury/envey/commit/0a11ad8bc0c57ce4113f1e78dae1c2dfb9e0d34c))

## [2.2.1](https://github.com/samialdury/envey/compare/v2.2.0...v2.2.1) (2023-10-17)


### Bug Fixes

* bundle configuration ([b381e3a](https://github.com/samialdury/envey/commit/b381e3ac1323f30761b3409d396e7a4df34c7fe1))

# [2.2.0](https://github.com/samialdury/envey/compare/v2.1.0...v2.2.0) (2023-09-26)


### Features

* add `bool` helper for Zod ([4e47376](https://github.com/samialdury/envey/commit/4e47376138cfc44607f8a4e13adc36bf43a23ff0))

# [2.1.0](https://github.com/samialdury/envey/compare/v2.0.0...v2.1.0) (2023-09-14)


### Features

* upgrade to Node 20 ([ea3b549](https://github.com/samialdury/envey/commit/ea3b549cf3bcc430750db696d1a76e948bbadbb6))

# [2.0.0](https://github.com/samialdury/envey/compare/v1.2.0...v2.0.0) (2023-08-24)


* feat!: return error instead of throwing it ([08221a0](https://github.com/samialdury/envey/commit/08221a0a1a54d806a6e9e5346ac88c63508ceb54))


### BREAKING CHANGES

* `createConfig` no longer throws an error if validation fails,
instead returns a discriminated union with the parsed result or the error.

# [1.2.0](https://github.com/samialdury/envey/compare/v1.1.3...v1.2.0) (2023-08-07)


### Features

* update dependencies, include sourcemaps, update release process ([cec8c45](https://github.com/samialdury/envey/commit/cec8c4591276b2e1952fa91a5027fc3338e6f2ea))
