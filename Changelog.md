# v1.0.3

- Added the function of `getKeysOfPattern`, which will be simpler to find keys by pattern.
- Fixed a bug in function `client.keyExists`

# v1.0.2

- Added the quick command of `getServerInfo` to retrieve the running info of Redis server
- Added more quick command for list, they are: `listGetFirst` / `listGetLast` pair, and `listShift` / `listPop` pair
- Fixed one bug that `setObject` will fail when some field is set to value `undefined`. Now the `undefined` field will not sent to Redis
# v1.0.1

- Some improvement in `client.setObject` and `client.getObject` function
- Add null type for `ObjInRedis`
- Return `null` for non-existing keys read via `client.getObject` function. Which is more reasonable.
- Add `shutdown` function for the pool.

# v1.0.0

- Initial publish