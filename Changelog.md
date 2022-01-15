# v1.0.2

- Added the quick command of `getServerInfo` to retrieve the running info of Redis server

# v1.0.1

- Some improvement in `client.setObject` and `client.getObject` function
- Add null type for `ObjInRedis`
- Return `null` for non-existing keys read via `client.getObject` function. Which is more reasonable.
- Add `shutdown` function for the pool.

# v1.0.0

- Initial publish