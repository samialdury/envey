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
