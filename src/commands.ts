/**
 * The redis commands in a big list. 
 */
export default {

  /**
   * @Usage ACL CAT [categoryname]
   * @Purpose List the ACL categories or the commands inside a category
   */
  ACL_CAT: ["ACL", "CAT"],

  /**
   * @Usage ACL DELUSER username [username ...]
   * @Purpose Remove the specified ACL users and the associated rules
   */
  ACL_DELUSER: ["ACL", "DELUSER"],

  /**
   * @Usage ACL GENPASS [bits]
   * @Purpose Generate a pseudorandom secure password to use for ACL users
   */
  ACL_GENPASS: ["ACL", "GENPASS"],

  /**
   * @Usage ACL GETUSER username
   * @Purpose Get the rules for a specific ACL user
   */
  ACL_GETUSER: ["ACL", "GETUSER"],

  /**
   * @Usage ACL LIST
   * @Purpose List the current ACL rules in ACL config file format
   */
  ACL_LIST: ["ACL", "LIST"],

  /**
   * @Usage ACL LOAD
   * @Purpose Reload the ACLs from the configured ACL file
   */
  ACL_LOAD: ["ACL", "LOAD"],

  /**
   * @Usage ACL LOG [count|RESET]
   * @Purpose List latest events denied because of ACLs in place
   */
  ACL_LOG: ["ACL", "LOG"],

  /**
   * @Usage ACL SAVE
   * @Purpose Save the current ACL rules in the configured ACL file
   */
  ACL_SAVE: ["ACL", "SAVE"],

  /**
   * @Usage ACL SETUSER username [rule [rule ...]]
   * @Purpose Modify or create the rules for a specific ACL user
   */
  ACL_SETUSER: ["ACL", "SETUSER"],

  /**
   * @Usage ACL USERS
   * @Purpose List the username of all the configured ACL rules
   */
  ACL_USERS: ["ACL", "USERS"],

  /**
   * @Usage ACL WHOAMI
   * @Purpose Return the name of the user associated to the current connection
   */
  ACL_WHOAMI: ["ACL", "WHOAMI"],

  /**
   * @Usage BGREWRITEAOF
   * @Purpose Asynchronously rewrite the append-only file
   */
  BGREWRITEAOF: ["BGREWRITEAOF"],

  /**
   * @Usage BGSAVE [SCHEDULE]
   * @Purpose Asynchronously save the dataset to disk
   */
  BGSAVE: ["BGSAVE"],

  /**
   * @Usage COMMAND
   * @Purpose Get array of Redis command details
   */
  COMMAND: ["COMMAND"],

  /**
   * @Usage COMMAND COUNT
   * @Purpose Get total number of Redis commands
   */
  COMMAND_COUNT: ["COMMAND", "COUNT"],

  /**
   * @Usage COMMAND GETKEYS
   * @Purpose Extract keys given a full Redis command
   */
  COMMAND_GETKEYS: ["COMMAND", "GETKEYS"],

  /**
   * @Usage COMMAND INFO command-name [command-name ...]
   * @Purpose Get array of specific Redis command details
   */
  COMMAND_INFO: ["COMMAND", "INFO"],

  /**
   * @Usage COMMAND LIST [FILTERBY MODULE module-name|ACLCAT category|PATTERN pattern]
   * @Purpose Get an array of Redis command names
   */
  COMMAND_LIST: ["COMMAND", "LIST"],

  /**
   * @Usage CONFIG GET parameter [parameter ...]
   * @Purpose Get the values of configuration parameters
   */
  CONFIG_GET: ["CONFIG", "GET"],

  /**
   * @Usage CONFIG RESETSTAT
   * @Purpose Reset the stats returned by INFO
   */
  CONFIG_RESETSTAT: ["CONFIG", "RESETSTAT"],

  /**
   * @Usage CONFIG REWRITE
   * @Purpose Rewrite the configuration file with the in memory configuration
   */
  CONFIG_REWRITE: ["CONFIG", "REWRITE"],

  /**
   * @Usage CONFIG SET parameter value [parameter value ...]
   * @Purpose Set configuration parameters to the given values
   */
  CONFIG_SET: ["CONFIG", "SET"],

  /**
   * @Usage DBSIZE
   * @Purpose Return the number of keys in the selected database
   */
  DBSIZE: ["DBSIZE"],

  /**
   * @Usage FAILOVER [TO host port [FORCE]] [ABORT] [TIMEOUT milliseconds]
   * @Purpose Start a coordinated failover between this server and one of its replicas.
   */
  FAILOVER: ["FAILOVER"],

  /**
   * @Usage FLUSHALL [ASYNC|SYNC]
   * @Purpose Remove all keys from all databases
   */
  FLUSHALL: ["FLUSHALL"],

  /**
   * @Usage FLUSHDB [ASYNC|SYNC]
   * @Purpose Remove all keys from the current database
   */
  FLUSHDB: ["FLUSHDB"],

  /**
   * @Usage INFO [section]
   * @Purpose Get information and statistics about the server
   */
  INFO: ["INFO"],

  /**
   * @Usage LASTSAVE
   * @Purpose Get the UNIX time stamp of the last successful save to disk
   */
  LASTSAVE: ["LASTSAVE"],

  /**
   * @Usage LATENCY DOCTOR
   * @Purpose Return a human readable latency analysis report.
   */
  LATENCY_DOCTOR: ["LATENCY", "DOCTOR"],

  /**
   * @Usage LATENCY GRAPH event
   * @Purpose Return a latency graph for the event.
   */
  LATENCY_GRAPH: ["LATENCY", "GRAPH"],

  /**
   * @Usage LATENCY HISTORY event
   * @Purpose Return timestamp-latency samples for the event.
   */
  LATENCY_HISTORY: ["LATENCY", "HISTORY"],

  /**
   * @Usage LATENCY LATEST
   * @Purpose Return the latest latency samples for all events.
   */
  LATENCY_LATEST: ["LATENCY", "LATEST"],

  /**
   * @Usage LATENCY RESET [event [event ...]]
   * @Purpose Reset latency data for one or more events.
   */
  LATENCY_RESET: ["LATENCY", "RESET"],

  /**
   * @Usage LOLWUT [VERSION version]
   * @Purpose Display some computer art and the Redis version
   */
  LOLWUT: ["LOLWUT"],

  /**
   * @Usage MEMORY DOCTOR
   * @Purpose Outputs memory problems report
   */
  MEMORY_DOCTOR: ["MEMORY", "DOCTOR"],

  /**
   * @Usage MEMORY MALLOC-STATS
   * @Purpose Show allocator internal stats
   */
  MEMORY_MALLOC_STATS: ["MEMORY", "MALLOC-STATS"],

  /**
   * @Usage MEMORY PURGE
   * @Purpose Ask the allocator to release memory
   */
  MEMORY_PURGE: ["MEMORY", "PURGE"],

  /**
   * @Usage MEMORY STATS
   * @Purpose Show memory usage details
   */
  MEMORY_STATS: ["MEMORY", "STATS"],

  /**
   * @Usage MEMORY USAGE key [SAMPLES count]
   * @Purpose Estimate the memory usage of a key
   */
  MEMORY_USAGE: ["MEMORY", "USAGE"],

  /**
   * @Usage MODULE LIST
   * @Purpose List all modules loaded by the server
   */
  MODULE_LIST: ["MODULE", "LIST"],

  /**
   * @Usage MODULE LOAD path [arg [arg ...]]
   * @Purpose Load a module
   */
  MODULE_LOAD: ["MODULE", "LOAD"],

  /**
   * @Usage MODULE UNLOAD name
   * @Purpose Unload a module
   */
  MODULE_UNLOAD: ["MODULE", "UNLOAD"],

  /**
   * @Usage MONITOR
   * @Purpose Listen for all requests received by the server in real time
   */
  MONITOR: ["MONITOR"],

  /**
   * @Usage PSYNC replicationid offset
   * @Purpose Internal command used for replication
   */
  PSYNC: ["PSYNC"],

  /**
   * @Usage REPLCONF
   * @Purpose An internal command for configuring the replication stream
   */
  REPLCONF: ["REPLCONF"],

  /**
   * @Usage REPLICAOF host port
   * @Purpose Make the server a replica of another instance, or promote it as master.
   */
  REPLICAOF: ["REPLICAOF"],

  /**
   * @Usage RESTORE-ASKING
   * @Purpose An internal command for migrating keys in a cluster
   */
  RESTORE_ASKING: ["RESTORE-ASKING"],

  /**
   * @Usage ROLE
   * @Purpose Return the role of the instance in the context of replication
   */
  ROLE: ["ROLE"],

  /**
   * @Usage SAVE
   * @Purpose Synchronously save the dataset to disk
   */
  SAVE: ["SAVE"],

  /**
   * @Usage SHUTDOWN [NOSAVE|SAVE] [NOW] [FORCE] [ABORT]
   * @Purpose Synchronously save the dataset to disk and then shut down the server
   */
  SHUTDOWN: ["SHUTDOWN"],

  /**
   * @Usage SLAVEOF host port
   * @Purpose Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.
   */
  SLAVEOF: ["SLAVEOF"],

  /**
   * @Usage SLOWLOG GET [count]
   * @Purpose Get the slow log's entries
   */
  SLOWLOG_GET: ["SLOWLOG", "GET"],

  /**
   * @Usage SLOWLOG LEN
   * @Purpose Get the slow log's length
   */
  SLOWLOG_LEN: ["SLOWLOG", "LEN"],

  /**
   * @Usage SLOWLOG RESET
   * @Purpose Clear all entries from the slow log
   */
  SLOWLOG_RESET: ["SLOWLOG", "RESET"],

  /**
   * @Usage SWAPDB index1 index2
   * @Purpose Swaps two Redis databases
   */
  SWAPDB: ["SWAPDB"],

  /**
   * @Usage SYNC
   * @Purpose Internal command used for replication
   */
  SYNC: ["SYNC"],

  /**
   * @Usage TIME
   * @Purpose Return the current server time
   */
  TIME: ["TIME"],

  /**
   * @Usage APPEND key value
   * @Purpose Append a value to a key
   */
  APPEND: ["APPEND"],

  /**
   * @Usage DECR key
   * @Purpose Decrement the integer value of a key by one
   */
  DECR: ["DECR"],

  /**
   * @Usage DECRBY key decrement
   * @Purpose Decrement the integer value of a key by the given number
   */
  DECRBY: ["DECRBY"],

  /**
   * @Usage GET key
   * @Purpose Get the value of a key
   */
  GET: ["GET"],

  /**
   * @Usage GETDEL key
   * @Purpose Get the value of a key and delete the key
   */
  GETDEL: ["GETDEL"],

  /**
   * @Usage GETEX key [EX seconds|PX milliseconds|EXAT unix-time|PXAT unix-time|PERSIST]
   * @Purpose Get the value of a key and optionally set its expiration
   */
  GETEX: ["GETEX"],

  /**
   * @Usage GETRANGE key start end
   * @Purpose Get a substring of the string stored at a key
   */
  GETRANGE: ["GETRANGE"],

  /**
   * @Usage GETSET key value
   * @Purpose Set the string value of a key and return its old value
   */
  GETSET: ["GETSET"],

  /**
   * @Usage INCR key
   * @Purpose Increment the integer value of a key by one
   */
  INCR: ["INCR"],

  /**
   * @Usage INCRBY key increment
   * @Purpose Increment the integer value of a key by the given amount
   */
  INCRBY: ["INCRBY"],

  /**
   * @Usage INCRBYFLOAT key increment
   * @Purpose Increment the float value of a key by the given amount
   */
  INCRBYFLOAT: ["INCRBYFLOAT"],

  /**
   * @Usage LCS key1 key2 [LEN] [IDX] [MINMATCHLEN len] [WITHMATCHLEN]
   * @Purpose Find longest common substring
   */
  LCS: ["LCS"],

  /**
   * @Usage MGET key [key ...]
   * @Purpose Get the values of all the given keys
   */
  MGET: ["MGET"],

  /**
   * @Usage MSET key value [key value ...]
   * @Purpose Set multiple keys to multiple values
   */
  MSET: ["MSET"],

  /**
   * @Usage MSETNX key value [key value ...]
   * @Purpose Set multiple keys to multiple values, only if none of the keys exist
   */
  MSETNX: ["MSETNX"],

  /**
   * @Usage PSETEX key milliseconds value
   * @Purpose Set the value and expiration in milliseconds of a key
   */
  PSETEX: ["PSETEX"],

  /**
   * @Usage SET key value [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL] [NX|XX] [GET]
   * @Purpose Set the string value of a key
   */
  SET: ["SET"],

  /**
   * @Usage SETEX key seconds value
   * @Purpose Set the value and expiration of a key
   */
  SETEX: ["SETEX"],

  /**
   * @Usage SETNX key value
   * @Purpose Set the value of a key, only if the key does not exist
   */
  SETNX: ["SETNX"],

  /**
   * @Usage SETRANGE key offset value
   * @Purpose Overwrite part of a string at key starting at the specified offset
   */
  SETRANGE: ["SETRANGE"],

  /**
   * @Usage STRLEN key
   * @Purpose Get the length of the value stored in a key
   */
  STRLEN: ["STRLEN"],

  /**
   * @Usage SUBSTR key start end
   * @Purpose Get a substring of the string stored at a key
   */
  SUBSTR: ["SUBSTR"],

  /**
   * @Usage ASKING
   * @Purpose Sent by cluster clients after an -ASK redirect
   */
  ASKING: ["ASKING"],

  /**
   * @Usage CLUSTER ADDSLOTS slot [slot ...]
   * @Purpose Assign new hash slots to receiving node
   */
  CLUSTER_ADDSLOTS: ["CLUSTER", "ADDSLOTS"],

  /**
   * @Usage CLUSTER ADDSLOTSRANGE start-slot end-slot [start-slot end-slot ...]
   * @Purpose Assign new hash slots to receiving node
   */
  CLUSTER_ADDSLOTSRANGE: ["CLUSTER", "ADDSLOTSRANGE"],

  /**
   * @Usage CLUSTER BUMPEPOCH
   * @Purpose Advance the cluster config epoch
   */
  CLUSTER_BUMPEPOCH: ["CLUSTER", "BUMPEPOCH"],

  /**
   * @Usage CLUSTER COUNT-FAILURE-REPORTS node-id
   * @Purpose Return the number of failure reports active for a given node
   */
  CLUSTER_COUNT_FAILURE_REPORTS: ["CLUSTER", "COUNT-FAILURE-REPORTS"],

  /**
   * @Usage CLUSTER COUNTKEYSINSLOT slot
   * @Purpose Return the number of local keys in the specified hash slot
   */
  CLUSTER_COUNTKEYSINSLOT: ["CLUSTER", "COUNTKEYSINSLOT"],

  /**
   * @Usage CLUSTER DELSLOTS slot [slot ...]
   * @Purpose Set hash slots as unbound in receiving node
   */
  CLUSTER_DELSLOTS: ["CLUSTER", "DELSLOTS"],

  /**
   * @Usage CLUSTER DELSLOTSRANGE start-slot end-slot [start-slot end-slot ...]
   * @Purpose Set hash slots as unbound in receiving node
   */
  CLUSTER_DELSLOTSRANGE: ["CLUSTER", "DELSLOTSRANGE"],

  /**
   * @Usage CLUSTER FAILOVER [FORCE|TAKEOVER]
   * @Purpose Forces a replica to perform a manual failover of its master.
   */
  CLUSTER_FAILOVER: ["CLUSTER", "FAILOVER"],

  /**
   * @Usage CLUSTER FLUSHSLOTS
   * @Purpose Delete a node's own slots information
   */
  CLUSTER_FLUSHSLOTS: ["CLUSTER", "FLUSHSLOTS"],

  /**
   * @Usage CLUSTER FORGET node-id
   * @Purpose Remove a node from the nodes table
   */
  CLUSTER_FORGET: ["CLUSTER", "FORGET"],

  /**
   * @Usage CLUSTER GETKEYSINSLOT slot count
   * @Purpose Return local key names in the specified hash slot
   */
  CLUSTER_GETKEYSINSLOT: ["CLUSTER", "GETKEYSINSLOT"],

  /**
   * @Usage CLUSTER INFO
   * @Purpose Provides info about Redis Cluster node state
   */
  CLUSTER_INFO: ["CLUSTER", "INFO"],

  /**
   * @Usage CLUSTER KEYSLOT key
   * @Purpose Returns the hash slot of the specified key
   */
  CLUSTER_KEYSLOT: ["CLUSTER", "KEYSLOT"],

  /**
   * @Usage CLUSTER LINKS
   * @Purpose Returns a list of all TCP links to and from peer nodes in cluster
   */
  CLUSTER_LINKS: ["CLUSTER", "LINKS"],

  /**
   * @Usage CLUSTER MEET ip port
   * @Purpose Force a node cluster to handshake with another node
   */
  CLUSTER_MEET: ["CLUSTER", "MEET"],

  /**
   * @Usage CLUSTER MYID
   * @Purpose Return the node id
   */
  CLUSTER_MYID: ["CLUSTER", "MYID"],

  /**
   * @Usage CLUSTER NODES
   * @Purpose Get Cluster config for the node
   */
  CLUSTER_NODES: ["CLUSTER", "NODES"],

  /**
   * @Usage CLUSTER REPLICAS node-id
   * @Purpose List replica nodes of the specified master node
   */
  CLUSTER_REPLICAS: ["CLUSTER", "REPLICAS"],

  /**
   * @Usage CLUSTER REPLICATE node-id
   * @Purpose Reconfigure a node as a replica of the specified master node
   */
  CLUSTER_REPLICATE: ["CLUSTER", "REPLICATE"],

  /**
   * @Usage CLUSTER RESET [HARD|SOFT]
   * @Purpose Reset a Redis Cluster node
   */
  CLUSTER_RESET: ["CLUSTER", "RESET"],

  /**
   * @Usage CLUSTER SAVECONFIG
   * @Purpose Forces the node to save cluster state on disk
   */
  CLUSTER_SAVECONFIG: ["CLUSTER", "SAVECONFIG"],

  /**
   * @Usage CLUSTER SET-CONFIG-EPOCH config-epoch
   * @Purpose Set the configuration epoch in a new node
   */
  CLUSTER_SET_CONFIG_EPOCH: ["CLUSTER", "SET-CONFIG-EPOCH"],

  /**
   * @Usage CLUSTER SETSLOT slot IMPORTING node-id|MIGRATING node-id|NODE node-id|STABLE
   * @Purpose Bind a hash slot to a specific node
   */
  CLUSTER_SETSLOT: ["CLUSTER", "SETSLOT"],

  /**
   * @Usage CLUSTER SLAVES node-id
   * @Purpose List replica nodes of the specified master node
   */
  CLUSTER_SLAVES: ["CLUSTER", "SLAVES"],

  /**
   * @Usage CLUSTER SLOTS
   * @Purpose Get array of Cluster slot to node mappings
   */
  CLUSTER_SLOTS: ["CLUSTER", "SLOTS"],

  /**
   * @Usage READONLY
   * @Purpose Enables read queries for a connection to a cluster replica node
   */
  READONLY: ["READONLY"],

  /**
   * @Usage READWRITE
   * @Purpose Disables read queries for a connection to a cluster replica node
   */
  READWRITE: ["READWRITE"],

  /**
   * @Usage AUTH [username] password
   * @Purpose Authenticate to the server
   */
  AUTH: ["AUTH"],

  /**
   * @Usage CLIENT CACHING YES|NO
   * @Purpose Instruct the server about tracking or not keys in the next request
   */
  CLIENT_CACHING: ["CLIENT", "CACHING"],

  /**
   * @Usage CLIENT GETNAME
   * @Purpose Get the current connection name
   */
  CLIENT_GETNAME: ["CLIENT", "GETNAME"],

  /**
   * @Usage CLIENT GETREDIR
   * @Purpose Get tracking notifications redirection client ID if any
   */
  CLIENT_GETREDIR: ["CLIENT", "GETREDIR"],

  /**
   * @Usage CLIENT ID
   * @Purpose Returns the client ID for the current connection
   */
  CLIENT_ID: ["CLIENT", "ID"],

  /**
   * @Usage CLIENT INFO
   * @Purpose Returns information about the current client connection.
   */
  CLIENT_INFO: ["CLIENT", "INFO"],

  /**
   * @Usage CLIENT KILL [ip:port] [ID client-id] [TYPE NORMAL|MASTER|SLAVE|REPLICA|PUBSUB] [USER username] [ADDR ip:port] [LADDR ip:port] [SKIPME yes/no]
   * @Purpose Kill the connection of a client
   */
  CLIENT_KILL: ["CLIENT", "KILL"],

  /**
   * @Usage CLIENT LIST [TYPE NORMAL|MASTER|REPLICA|PUBSUB] [ID client-id [client-id ...]]
   * @Purpose Get the list of client connections
   */
  CLIENT_LIST: ["CLIENT", "LIST"],

  /**
   * @Usage CLIENT NO-EVICT ON|OFF
   * @Purpose Set client eviction mode for the current connection
   */
  CLIENT_NO_EVICT: ["CLIENT", "NO-EVICT"],

  /**
   * @Usage CLIENT PAUSE timeout [WRITE|ALL]
   * @Purpose Stop processing commands from clients for some time
   */
  CLIENT_PAUSE: ["CLIENT", "PAUSE"],

  /**
   * @Usage CLIENT REPLY ON|OFF|SKIP
   * @Purpose Instruct the server whether to reply to commands
   */
  CLIENT_REPLY: ["CLIENT", "REPLY"],

  /**
   * @Usage CLIENT SETNAME connection-name
   * @Purpose Set the current connection name
   */
  CLIENT_SETNAME: ["CLIENT", "SETNAME"],

  /**
   * @Usage CLIENT TRACKING ON|OFF [REDIRECT client-id] [PREFIX prefix [PREFIX prefix ...]] [BCAST] [OPTIN] [OPTOUT] [NOLOOP]
   * @Purpose Enable or disable server assisted client side caching support
   */
  CLIENT_TRACKING: ["CLIENT", "TRACKING"],

  /**
   * @Usage CLIENT TRACKINGINFO
   * @Purpose Return information about server assisted client side caching for the current connection
   */
  CLIENT_TRACKINGINFO: ["CLIENT", "TRACKINGINFO"],

  /**
   * @Usage CLIENT UNBLOCK client-id [TIMEOUT|ERROR]
   * @Purpose Unblock a client blocked in a blocking command from a different connection
   */
  CLIENT_UNBLOCK: ["CLIENT", "UNBLOCK"],

  /**
   * @Usage CLIENT UNPAUSE
   * @Purpose Resume processing of clients that were paused
   */
  CLIENT_UNPAUSE: ["CLIENT", "UNPAUSE"],

  /**
   * @Usage ECHO message
   * @Purpose Echo the given string
   */
  ECHO: ["ECHO"],

  /**
   * @Usage HELLO [protover [AUTH username password] [SETNAME clientname]]
   * @Purpose Handshake with Redis
   */
  HELLO: ["HELLO"],

  /**
   * @Usage PING [message]
   * @Purpose Ping the server
   */
  PING: ["PING"],

  /**
   * @Usage QUIT
   * @Purpose Close the connection
   */
  QUIT: ["QUIT"],

  /**
   * @Usage RESET
   * @Purpose Reset the connection
   */
  RESET: ["RESET"],

  /**
   * @Usage SELECT index
   * @Purpose Change the selected database for the current connection
   */
  SELECT: ["SELECT"],

  /**
   * @Usage BITCOUNT key [start end [BYTE|BIT]]
   * @Purpose Count set bits in a string
   */
  BITCOUNT: ["BITCOUNT"],

  /**
   * @Usage BITFIELD key [GET encoding offset] [SET encoding offset value] [INCRBY encoding offset increment] [OVERFLOW WRAP|SAT|FAIL]
   * @Purpose Perform arbitrary bitfield integer operations on strings
   */
  BITFIELD: ["BITFIELD"],

  /**
   * @Usage BITFIELD_RO key GET encoding offset
   * @Purpose Perform arbitrary bitfield integer operations on strings. Read-only variant of BITFIELD
   */
  BITFIELD_RO: ["BITFIELD_RO"],

  /**
   * @Usage BITOP operation destkey key [key ...]
   * @Purpose Perform bitwise operations between strings
   */
  BITOP: ["BITOP"],

  /**
   * @Usage BITPOS key bit [start [end [BYTE|BIT]]]
   * @Purpose Find first bit set or clear in a string
   */
  BITPOS: ["BITPOS"],

  /**
   * @Usage GETBIT key offset
   * @Purpose Returns the bit value at offset in the string value stored at key
   */
  GETBIT: ["GETBIT"],

  /**
   * @Usage SETBIT key offset value
   * @Purpose Sets or clears the bit at offset in the string value stored at key
   */
  SETBIT: ["SETBIT"],

  /**
   * @Usage BLMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout
   * @Purpose Pop an element from a list, push it to another list and return it; or block until one is available
   */
  BLMOVE: ["BLMOVE"],

  /**
   * @Usage BLMPOP timeout numkeys key [key ...] LEFT|RIGHT [COUNT count]
   * @Purpose Pop elements from a list, or block until one is available
   */
  BLMPOP: ["BLMPOP"],

  /**
   * @Usage BLPOP key [key ...] timeout
   * @Purpose Remove and get the first element in a list, or block until one is available
   */
  BLPOP: ["BLPOP"],

  /**
   * @Usage BRPOP key [key ...] timeout
   * @Purpose Remove and get the last element in a list, or block until one is available
   */
  BRPOP: ["BRPOP"],

  /**
   * @Usage BRPOPLPUSH source destination timeout
   * @Purpose Pop an element from a list, push it to another list and return it; or block until one is available
   */
  BRPOPLPUSH: ["BRPOPLPUSH"],

  /**
   * @Usage LINDEX key index
   * @Purpose Get an element from a list by its index
   */
  LINDEX: ["LINDEX"],

  /**
   * @Usage LINSERT key BEFORE|AFTER pivot element
   * @Purpose Insert an element before or after another element in a list
   */
  LINSERT: ["LINSERT"],

  /**
   * @Usage LLEN key
   * @Purpose Get the length of a list
   */
  LLEN: ["LLEN"],

  /**
   * @Usage LMOVE source destination LEFT|RIGHT LEFT|RIGHT
   * @Purpose Pop an element from a list, push it to another list and return it
   */
  LMOVE: ["LMOVE"],

  /**
   * @Usage LMPOP numkeys key [key ...] LEFT|RIGHT [COUNT count]
   * @Purpose Pop elements from a list
   */
  LMPOP: ["LMPOP"],

  /**
   * @Usage LPOP key [count]
   * @Purpose Remove and get the first elements in a list
   */
  LPOP: ["LPOP"],

  /**
   * @Usage LPOS key element [RANK rank] [COUNT num-matches] [MAXLEN len]
   * @Purpose Return the index of matching elements on a list
   */
  LPOS: ["LPOS"],

  /**
   * @Usage LPUSH key element [element ...]
   * @Purpose Prepend one or multiple elements to a list
   */
  LPUSH: ["LPUSH"],

  /**
   * @Usage LPUSHX key element [element ...]
   * @Purpose Prepend an element to a list, only if the list exists
   */
  LPUSHX: ["LPUSHX"],

  /**
   * @Usage LRANGE key start stop
   * @Purpose Get a range of elements from a list
   */
  LRANGE: ["LRANGE"],

  /**
   * @Usage LREM key count element
   * @Purpose Remove elements from a list
   */
  LREM: ["LREM"],

  /**
   * @Usage LSET key index element
   * @Purpose Set the value of an element in a list by its index
   */
  LSET: ["LSET"],

  /**
   * @Usage LTRIM key start stop
   * @Purpose Trim a list to the specified range
   */
  LTRIM: ["LTRIM"],

  /**
   * @Usage RPOP key [count]
   * @Purpose Remove and get the last elements in a list
   */
  RPOP: ["RPOP"],

  /**
   * @Usage RPOPLPUSH source destination
   * @Purpose Remove the last element in a list, prepend it to another list and return it
   */
  RPOPLPUSH: ["RPOPLPUSH"],

  /**
   * @Usage RPUSH key element [element ...]
   * @Purpose Append one or multiple elements to a list
   */
  RPUSH: ["RPUSH"],

  /**
   * @Usage RPUSHX key element [element ...]
   * @Purpose Append an element to a list, only if the list exists
   */
  RPUSHX: ["RPUSHX"],

  /**
   * @Usage BZMPOP timeout numkeys key [key ...] MIN|MAX [COUNT count]
   * @Purpose Remove and return members with scores in a sorted set or block until one is available
   */
  BZMPOP: ["BZMPOP"],

  /**
   * @Usage BZPOPMAX key [key ...] timeout
   * @Purpose Remove and return the member with the highest score from one or more sorted sets, or block until one is available
   */
  BZPOPMAX: ["BZPOPMAX"],

  /**
   * @Usage BZPOPMIN key [key ...] timeout
   * @Purpose Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
   */
  BZPOPMIN: ["BZPOPMIN"],

  /**
   * @Usage ZADD key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]
   * @Purpose Add one or more members to a sorted set, or update its score if it already exists
   */
  ZADD: ["ZADD"],

  /**
   * @Usage ZCARD key
   * @Purpose Get the number of members in a sorted set
   */
  ZCARD: ["ZCARD"],

  /**
   * @Usage ZCOUNT key min max
   * @Purpose Count the members in a sorted set with scores within the given values
   */
  ZCOUNT: ["ZCOUNT"],

  /**
   * @Usage ZDIFF numkeys key [key ...] [WITHSCORES]
   * @Purpose Subtract multiple sorted sets
   */
  ZDIFF: ["ZDIFF"],

  /**
   * @Usage ZDIFFSTORE destination numkeys key [key ...]
   * @Purpose Subtract multiple sorted sets and store the resulting sorted set in a new key
   */
  ZDIFFSTORE: ["ZDIFFSTORE"],

  /**
   * @Usage ZINCRBY key increment member
   * @Purpose Increment the score of a member in a sorted set
   */
  ZINCRBY: ["ZINCRBY"],

  /**
   * @Usage ZINTER numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
   * @Purpose Intersect multiple sorted sets
   */
  ZINTER: ["ZINTER"],

  /**
   * @Usage ZINTERCARD numkeys key [key ...] [LIMIT limit]
   * @Purpose Intersect multiple sorted sets and return the cardinality of the result
   */
  ZINTERCARD: ["ZINTERCARD"],

  /**
   * @Usage ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
   * @Purpose Intersect multiple sorted sets and store the resulting sorted set in a new key
   */
  ZINTERSTORE: ["ZINTERSTORE"],

  /**
   * @Usage ZLEXCOUNT key min max
   * @Purpose Count the number of members in a sorted set between a given lexicographical range
   */
  ZLEXCOUNT: ["ZLEXCOUNT"],

  /**
   * @Usage ZMPOP numkeys key [key ...] MIN|MAX [COUNT count]
   * @Purpose Remove and return members with scores in a sorted set
   */
  ZMPOP: ["ZMPOP"],

  /**
   * @Usage ZMSCORE key member [member ...]
   * @Purpose Get the score associated with the given members in a sorted set
   */
  ZMSCORE: ["ZMSCORE"],

  /**
   * @Usage ZPOPMAX key [count]
   * @Purpose Remove and return members with the highest scores in a sorted set
   */
  ZPOPMAX: ["ZPOPMAX"],

  /**
   * @Usage ZPOPMIN key [count]
   * @Purpose Remove and return members with the lowest scores in a sorted set
   */
  ZPOPMIN: ["ZPOPMIN"],

  /**
   * @Usage ZRANDMEMBER key [count [WITHSCORES]]
   * @Purpose Get one or multiple random elements from a sorted set
   */
  ZRANDMEMBER: ["ZRANDMEMBER"],

  /**
   * @Usage ZRANGE key min max [BYSCORE|BYLEX] [REV] [LIMIT offset count] [WITHSCORES]
   * @Purpose Return a range of members in a sorted set
   */
  ZRANGE: ["ZRANGE"],

  /**
   * @Usage ZRANGEBYLEX key min max [LIMIT offset count]
   * @Purpose Return a range of members in a sorted set, by lexicographical range
   */
  ZRANGEBYLEX: ["ZRANGEBYLEX"],

  /**
   * @Usage ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
   * @Purpose Return a range of members in a sorted set, by score
   */
  ZRANGEBYSCORE: ["ZRANGEBYSCORE"],

  /**
   * @Usage ZRANGESTORE dst src min max [BYSCORE|BYLEX] [REV] [LIMIT offset count]
   * @Purpose Store a range of members from sorted set into another key
   */
  ZRANGESTORE: ["ZRANGESTORE"],

  /**
   * @Usage ZRANK key member
   * @Purpose Determine the index of a member in a sorted set
   */
  ZRANK: ["ZRANK"],

  /**
   * @Usage ZREM key member [member ...]
   * @Purpose Remove one or more members from a sorted set
   */
  ZREM: ["ZREM"],

  /**
   * @Usage ZREMRANGEBYLEX key min max
   * @Purpose Remove all members in a sorted set between the given lexicographical range
   */
  ZREMRANGEBYLEX: ["ZREMRANGEBYLEX"],

  /**
   * @Usage ZREMRANGEBYRANK key start stop
   * @Purpose Remove all members in a sorted set within the given indexes
   */
  ZREMRANGEBYRANK: ["ZREMRANGEBYRANK"],

  /**
   * @Usage ZREMRANGEBYSCORE key min max
   * @Purpose Remove all members in a sorted set within the given scores
   */
  ZREMRANGEBYSCORE: ["ZREMRANGEBYSCORE"],

  /**
   * @Usage ZREVRANGE key start stop [WITHSCORES]
   * @Purpose Return a range of members in a sorted set, by index, with scores ordered from high to low
   */
  ZREVRANGE: ["ZREVRANGE"],

  /**
   * @Usage ZREVRANGEBYLEX key max min [LIMIT offset count]
   * @Purpose Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
   */
  ZREVRANGEBYLEX: ["ZREVRANGEBYLEX"],

  /**
   * @Usage ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
   * @Purpose Return a range of members in a sorted set, by score, with scores ordered from high to low
   */
  ZREVRANGEBYSCORE: ["ZREVRANGEBYSCORE"],

  /**
   * @Usage ZREVRANK key member
   * @Purpose Determine the index of a member in a sorted set, with scores ordered from high to low
   */
  ZREVRANK: ["ZREVRANK"],

  /**
   * @Usage ZSCAN key cursor [MATCH pattern] [COUNT count]
   * @Purpose Incrementally iterate sorted sets elements and associated scores
   */
  ZSCAN: ["ZSCAN"],

  /**
   * @Usage ZSCORE key member
   * @Purpose Get the score associated with the given member in a sorted set
   */
  ZSCORE: ["ZSCORE"],

  /**
   * @Usage ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
   * @Purpose Add multiple sorted sets
   */
  ZUNION: ["ZUNION"],

  /**
   * @Usage ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
   * @Purpose Add multiple sorted sets and store the resulting sorted set in a new key
   */
  ZUNIONSTORE: ["ZUNIONSTORE"],

  /**
   * @Usage COPY source destination [DB destination-db] [REPLACE]
   * @Purpose Copy a key
   */
  COPY: ["COPY"],

  /**
   * @Usage DEL key [key ...]
   * @Purpose Delete a key
   */
  DEL: ["DEL"],

  /**
   * @Usage DUMP key
   * @Purpose Return a serialized version of the value stored at the specified key.
   */
  DUMP: ["DUMP"],

  /**
   * @Usage EXISTS key [key ...]
   * @Purpose Determine if a key exists
   */
  EXISTS: ["EXISTS"],

  /**
   * @Usage EXPIRE key seconds [NX|XX|GT|LT]
   * @Purpose Set a key's time to live in seconds
   */
  EXPIRE: ["EXPIRE"],

  /**
   * @Usage EXPIREAT key timestamp [NX|XX|GT|LT]
   * @Purpose Set the expiration for a key as a UNIX timestamp
   */
  EXPIREAT: ["EXPIREAT"],

  /**
   * @Usage EXPIRETIME key
   * @Purpose Get the expiration Unix timestamp for a key
   */
  EXPIRETIME: ["EXPIRETIME"],

  /**
   * @Usage KEYS pattern
   * @Purpose Find all keys matching the given pattern
   */
  KEYS: ["KEYS"],

  /**
   * @Usage MIGRATE host port key|"" destination-db timeout [COPY] [REPLACE] [AUTH password] [AUTH2 username password] [KEYS key [key ...]]
   * @Purpose Atomically transfer a key from a Redis instance to another one.
   */
  MIGRATE: ["MIGRATE"],

  /**
   * @Usage MOVE key db
   * @Purpose Move a key to another database
   */
  MOVE: ["MOVE"],

  /**
   * @Usage OBJECT ENCODING key
   * @Purpose Inspect the internal encoding of a Redis object
   */
  OBJECT_ENCODING: ["OBJECT", "ENCODING"],

  /**
   * @Usage OBJECT FREQ key
   * @Purpose Get the logarithmic access frequency counter of a Redis object
   */
  OBJECT_FREQ: ["OBJECT", "FREQ"],

  /**
   * @Usage OBJECT IDLETIME key
   * @Purpose Get the time since a Redis object was last accessed
   */
  OBJECT_IDLETIME: ["OBJECT", "IDLETIME"],

  /**
   * @Usage OBJECT REFCOUNT key
   * @Purpose Get the number of references to the value of the key
   */
  OBJECT_REFCOUNT: ["OBJECT", "REFCOUNT"],

  /**
   * @Usage PERSIST key
   * @Purpose Remove the expiration from a key
   */
  PERSIST: ["PERSIST"],

  /**
   * @Usage PEXPIRE key milliseconds [NX|XX|GT|LT]
   * @Purpose Set a key's time to live in milliseconds
   */
  PEXPIRE: ["PEXPIRE"],

  /**
   * @Usage PEXPIREAT key milliseconds-timestamp [NX|XX|GT|LT]
   * @Purpose Set the expiration for a key as a UNIX timestamp specified in milliseconds
   */
  PEXPIREAT: ["PEXPIREAT"],

  /**
   * @Usage PEXPIRETIME key
   * @Purpose Get the expiration Unix timestamp for a key in milliseconds
   */
  PEXPIRETIME: ["PEXPIRETIME"],

  /**
   * @Usage PTTL key
   * @Purpose Get the time to live for a key in milliseconds
   */
  PTTL: ["PTTL"],

  /**
   * @Usage RANDOMKEY
   * @Purpose Return a random key from the keyspace
   */
  RANDOMKEY: ["RANDOMKEY"],

  /**
   * @Usage RENAME key newkey
   * @Purpose Rename a key
   */
  RENAME: ["RENAME"],

  /**
   * @Usage RENAMENX key newkey
   * @Purpose Rename a key, only if the new key does not exist
   */
  RENAMENX: ["RENAMENX"],

  /**
   * @Usage RESTORE key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]
   * @Purpose Create a key using the provided serialized value, previously obtained using DUMP.
   */
  RESTORE: ["RESTORE"],

  /**
   * @Usage SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]
   * @Purpose Incrementally iterate the keys space
   */
  SCAN: ["SCAN"],

  /**
   * @Usage SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
   * @Purpose Sort the elements in a list, set or sorted set
   */
  SORT: ["SORT"],

  /**
   * @Usage SORT_RO key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA]
   * @Purpose Sort the elements in a list, set or sorted set. Read-only variant of SORT.
   */
  SORT_RO: ["SORT_RO"],

  /**
   * @Usage TOUCH key [key ...]
   * @Purpose Alters the last access time of a key(s). Returns the number of existing keys specified.
   */
  TOUCH: ["TOUCH"],

  /**
   * @Usage TTL key
   * @Purpose Get the time to live for a key in seconds
   */
  TTL: ["TTL"],

  /**
   * @Usage TYPE key
   * @Purpose Determine the type stored at key
   */
  TYPE: ["TYPE"],

  /**
   * @Usage UNLINK key [key ...]
   * @Purpose Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
   */
  UNLINK: ["UNLINK"],

  /**
   * @Usage WAIT numreplicas timeout
   * @Purpose Wait for the synchronous replication of all the write commands sent in the context of the current connection
   */
  WAIT: ["WAIT"],

  /**
   * @Usage DISCARD
   * @Purpose Discard all commands issued after MULTI
   */
  DISCARD: ["DISCARD"],

  /**
   * @Usage EXEC
   * @Purpose Execute all commands issued after MULTI
   */
  EXEC: ["EXEC"],

  /**
   * @Usage MULTI
   * @Purpose Mark the start of a transaction block
   */
  MULTI: ["MULTI"],

  /**
   * @Usage UNWATCH
   * @Purpose Forget about all watched keys
   */
  UNWATCH: ["UNWATCH"],

  /**
   * @Usage WATCH key [key ...]
   * @Purpose Watch the given keys to determine execution of the MULTI/EXEC block
   */
  WATCH: ["WATCH"],

  /**
   * @Usage EVAL script numkeys [key [key ...]] [arg [arg ...]]
   * @Purpose Execute a Lua script server side
   */
  EVAL: ["EVAL"],

  /**
   * @Usage EVALSHA sha1 numkeys [key [key ...]] [arg [arg ...]]
   * @Purpose Execute a Lua script server side
   */
  EVALSHA: ["EVALSHA"],

  /**
   * @Usage EVALSHA_RO sha1 numkeys key [key ...] arg [arg ...]
   * @Purpose Execute a read-only Lua script server side
   */
  EVALSHA_RO: ["EVALSHA_RO"],

  /**
   * @Usage EVAL_RO script numkeys key [key ...] arg [arg ...]
   * @Purpose Execute a read-only Lua script server side
   */
  EVAL_RO: ["EVAL_RO"],

  /**
   * @Usage FCALL function numkeys key [key ...] arg [arg ...]
   * @Purpose PATCH__TBD__38__
   */
  FCALL: ["FCALL"],

  /**
   * @Usage FCALL_RO function numkeys key [key ...] arg [arg ...]
   * @Purpose PATCH__TBD__7__
   */
  FCALL_RO: ["FCALL_RO"],

  /**
   * @Usage FUNCTION CREATE engine-name function-name [REPLACE] [DESC function-description] function-code
   * @Purpose Create a function with the given arguments (name, code, description)
   */
  FUNCTION_CREATE: ["FUNCTION", "CREATE"],

  /**
   * @Usage FUNCTION DELETE function-name
   * @Purpose Delete a function by name
   */
  FUNCTION_DELETE: ["FUNCTION", "DELETE"],

  /**
   * @Usage FUNCTION DUMP
   * @Purpose Dump all functions into a serialized binary payload
   */
  FUNCTION_DUMP: ["FUNCTION", "DUMP"],

  /**
   * @Usage FUNCTION FLUSH [ASYNC|SYNC]
   * @Purpose Deleting all functions
   */
  FUNCTION_FLUSH: ["FUNCTION", "FLUSH"],

  /**
   * @Usage FUNCTION INFO function-name [WITHCODE]
   * @Purpose Return information about a function by function name
   */
  FUNCTION_INFO: ["FUNCTION", "INFO"],

  /**
   * @Usage FUNCTION KILL
   * @Purpose Kill the function currently in execution.
   */
  FUNCTION_KILL: ["FUNCTION", "KILL"],

  /**
   * @Usage FUNCTION LIST
   * @Purpose List information about all the functions
   */
  FUNCTION_LIST: ["FUNCTION", "LIST"],

  /**
   * @Usage FUNCTION RESTORE serialized-value [FLUSH|APPEND|REPLACE]
   * @Purpose Restore all the functions on the given payload
   */
  FUNCTION_RESTORE: ["FUNCTION", "RESTORE"],

  /**
   * @Usage FUNCTION STATS
   * @Purpose Return information about the function currently running (name, description, duration)
   */
  FUNCTION_STATS: ["FUNCTION", "STATS"],

  /**
   * @Usage SCRIPT DEBUG YES|SYNC|NO
   * @Purpose Set the debug mode for executed scripts.
   */
  SCRIPT_DEBUG: ["SCRIPT", "DEBUG"],

  /**
   * @Usage SCRIPT EXISTS sha1 [sha1 ...]
   * @Purpose Check existence of scripts in the script cache.
   */
  SCRIPT_EXISTS: ["SCRIPT", "EXISTS"],

  /**
   * @Usage SCRIPT FLUSH [ASYNC|SYNC]
   * @Purpose Remove all the scripts from the script cache.
   */
  SCRIPT_FLUSH: ["SCRIPT", "FLUSH"],

  /**
   * @Usage SCRIPT KILL
   * @Purpose Kill the script currently in execution.
   */
  SCRIPT_KILL: ["SCRIPT", "KILL"],

  /**
   * @Usage SCRIPT LOAD script
   * @Purpose Load the specified Lua script into the script cache.
   */
  SCRIPT_LOAD: ["SCRIPT", "LOAD"],

  /**
   * @Usage GEOADD key [NX|XX] [CH] longitude latitude member [longitude latitude member ...]
   * @Purpose Add one or more geospatial items in the geospatial index represented using a sorted set
   */
  GEOADD: ["GEOADD"],

  /**
   * @Usage GEODIST key member1 member2 [M|KM|FT|MI]
   * @Purpose Returns the distance between two members of a geospatial index
   */
  GEODIST: ["GEODIST"],

  /**
   * @Usage GEOHASH key member [member ...]
   * @Purpose Returns members of a geospatial index as standard geohash strings
   */
  GEOHASH: ["GEOHASH"],

  /**
   * @Usage GEOPOS key member [member ...]
   * @Purpose Returns longitude and latitude of members of a geospatial index
   */
  GEOPOS: ["GEOPOS"],

  /**
   * @Usage GEORADIUS key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key] [STOREDIST key]
   * @Purpose Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point
   */
  GEORADIUS: ["GEORADIUS"],

  /**
   * @Usage GEORADIUSBYMEMBER key member radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key] [STOREDIST key]
   * @Purpose Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member
   */
  GEORADIUSBYMEMBER: ["GEORADIUSBYMEMBER"],

  /**
   * @Usage GEORADIUSBYMEMBER_RO key member radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC]
   * @Purpose A read-only variant for GEORADIUSBYMEMBER
   */
  GEORADIUSBYMEMBER_RO: ["GEORADIUSBYMEMBER_RO"],

  /**
   * @Usage GEORADIUS_RO key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC]
   * @Purpose A read-only variant for GEORADIUS
   */
  GEORADIUS_RO: ["GEORADIUS_RO"],

  /**
   * @Usage GEOSEARCH key [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius M|KM|FT|MI] [BYBOX width height M|KM|FT|MI] [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH]
   * @Purpose Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle.
   */
  GEOSEARCH: ["GEOSEARCH"],

  /**
   * @Usage GEOSEARCHSTORE destination source [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius M|KM|FT|MI] [BYBOX width height M|KM|FT|MI] [ASC|DESC] [COUNT count [ANY]] [STOREDIST]
   * @Purpose Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle, and store the result in another key.
   */
  GEOSEARCHSTORE: ["GEOSEARCHSTORE"],

  /**
   * @Usage HDEL key field [field ...]
   * @Purpose Delete one or more hash fields
   */
  HDEL: ["HDEL"],

  /**
   * @Usage HEXISTS key field
   * @Purpose Determine if a hash field exists
   */
  HEXISTS: ["HEXISTS"],

  /**
   * @Usage HGET key field
   * @Purpose Get the value of a hash field
   */
  HGET: ["HGET"],

  /**
   * @Usage HGETALL key
   * @Purpose Get all the fields and values in a hash
   */
  HGETALL: ["HGETALL"],

  /**
   * @Usage HINCRBY key field increment
   * @Purpose Increment the integer value of a hash field by the given number
   */
  HINCRBY: ["HINCRBY"],

  /**
   * @Usage HINCRBYFLOAT key field increment
   * @Purpose Increment the float value of a hash field by the given amount
   */
  HINCRBYFLOAT: ["HINCRBYFLOAT"],

  /**
   * @Usage HKEYS key
   * @Purpose Get all the fields in a hash
   */
  HKEYS: ["HKEYS"],

  /**
   * @Usage HLEN key
   * @Purpose Get the number of fields in a hash
   */
  HLEN: ["HLEN"],

  /**
   * @Usage HMGET key field [field ...]
   * @Purpose Get the values of all the given hash fields
   */
  HMGET: ["HMGET"],

  /**
   * @Usage HMSET key field value [field value ...]
   * @Purpose Set multiple hash fields to multiple values
   */
  HMSET: ["HMSET"],

  /**
   * @Usage HRANDFIELD key [count [WITHVALUES]]
   * @Purpose Get one or multiple random fields from a hash
   */
  HRANDFIELD: ["HRANDFIELD"],

  /**
   * @Usage HSCAN key cursor [MATCH pattern] [COUNT count]
   * @Purpose Incrementally iterate hash fields and associated values
   */
  HSCAN: ["HSCAN"],

  /**
   * @Usage HSET key field value [field value ...]
   * @Purpose Set the string value of a hash field
   */
  HSET: ["HSET"],

  /**
   * @Usage HSETNX key field value
   * @Purpose Set the value of a hash field, only if the field does not exist
   */
  HSETNX: ["HSETNX"],

  /**
   * @Usage HSTRLEN key field
   * @Purpose Get the length of the value of a hash field
   */
  HSTRLEN: ["HSTRLEN"],

  /**
   * @Usage HVALS key
   * @Purpose Get all the values in a hash
   */
  HVALS: ["HVALS"],

  /**
   * @Usage PFADD key [element [element ...]]
   * @Purpose Adds the specified elements to the specified HyperLogLog.
   */
  PFADD: ["PFADD"],

  /**
   * @Usage PFCOUNT key [key ...]
   * @Purpose Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
   */
  PFCOUNT: ["PFCOUNT"],

  /**
   * @Usage PFDEBUG
   * @Purpose Internal commands for debugging HyperLogLog values
   */
  PFDEBUG: ["PFDEBUG"],

  /**
   * @Usage PFMERGE destkey sourcekey [sourcekey ...]
   * @Purpose Merge N different HyperLogLogs into a single one.
   */
  PFMERGE: ["PFMERGE"],

  /**
   * @Usage PFSELFTEST
   * @Purpose An internal command for testing HyperLogLog values
   */
  PFSELFTEST: ["PFSELFTEST"],

  /**
   * @Usage PSUBSCRIBE pattern [pattern ...]
   * @Purpose Listen for messages published to channels matching the given patterns
   */
  PSUBSCRIBE: ["PSUBSCRIBE"],

  /**
   * @Usage PUBLISH channel message
   * @Purpose Post a message to a channel
   */
  PUBLISH: ["PUBLISH"],

  /**
   * @Usage PUBSUB CHANNELS [pattern]
   * @Purpose List active channels
   */
  PUBSUB_CHANNELS: ["PUBSUB", "CHANNELS"],

  /**
   * @Usage PUBSUB NUMPAT
   * @Purpose Get the count of unique patterns pattern subscriptions
   */
  PUBSUB_NUMPAT: ["PUBSUB", "NUMPAT"],

  /**
   * @Usage PUBSUB NUMSUB [channel [channel ...]]
   * @Purpose Get the count of subscribers for channels
   */
  PUBSUB_NUMSUB: ["PUBSUB", "NUMSUB"],

  /**
   * @Usage PUNSUBSCRIBE [pattern [pattern ...]]
   * @Purpose Stop listening for messages posted to channels matching the given patterns
   */
  PUNSUBSCRIBE: ["PUNSUBSCRIBE"],

  /**
   * @Usage SUBSCRIBE channel [channel ...]
   * @Purpose Listen for messages published to the given channels
   */
  SUBSCRIBE: ["SUBSCRIBE"],

  /**
   * @Usage UNSUBSCRIBE [channel [channel ...]]
   * @Purpose Stop listening for messages posted to the given channels
   */
  UNSUBSCRIBE: ["UNSUBSCRIBE"],

  /**
   * @Usage SADD key member [member ...]
   * @Purpose Add one or more members to a set
   */
  SADD: ["SADD"],

  /**
   * @Usage SCARD key
   * @Purpose Get the number of members in a set
   */
  SCARD: ["SCARD"],

  /**
   * @Usage SDIFF key [key ...]
   * @Purpose Subtract multiple sets
   */
  SDIFF: ["SDIFF"],

  /**
   * @Usage SDIFFSTORE destination key [key ...]
   * @Purpose Subtract multiple sets and store the resulting set in a key
   */
  SDIFFSTORE: ["SDIFFSTORE"],

  /**
   * @Usage SINTER key [key ...]
   * @Purpose Intersect multiple sets
   */
  SINTER: ["SINTER"],

  /**
   * @Usage SINTERCARD numkeys key [key ...] [LIMIT limit]
   * @Purpose Intersect multiple sets and return the cardinality of the result
   */
  SINTERCARD: ["SINTERCARD"],

  /**
   * @Usage SINTERSTORE destination key [key ...]
   * @Purpose Intersect multiple sets and store the resulting set in a key
   */
  SINTERSTORE: ["SINTERSTORE"],

  /**
   * @Usage SISMEMBER key member
   * @Purpose Determine if a given value is a member of a set
   */
  SISMEMBER: ["SISMEMBER"],

  /**
   * @Usage SMEMBERS key
   * @Purpose Get all the members in a set
   */
  SMEMBERS: ["SMEMBERS"],

  /**
   * @Usage SMISMEMBER key member [member ...]
   * @Purpose Returns the membership associated with the given elements for a set
   */
  SMISMEMBER: ["SMISMEMBER"],

  /**
   * @Usage SMOVE source destination member
   * @Purpose Move a member from one set to another
   */
  SMOVE: ["SMOVE"],

  /**
   * @Usage SPOP key [count]
   * @Purpose Remove and return one or multiple random members from a set
   */
  SPOP: ["SPOP"],

  /**
   * @Usage SRANDMEMBER key [count]
   * @Purpose Get one or multiple random members from a set
   */
  SRANDMEMBER: ["SRANDMEMBER"],

  /**
   * @Usage SREM key member [member ...]
   * @Purpose Remove one or more members from a set
   */
  SREM: ["SREM"],

  /**
   * @Usage SSCAN key cursor [MATCH pattern] [COUNT count]
   * @Purpose Incrementally iterate Set elements
   */
  SSCAN: ["SSCAN"],

  /**
   * @Usage SUNION key [key ...]
   * @Purpose Add multiple sets
   */
  SUNION: ["SUNION"],

  /**
   * @Usage SUNIONSTORE destination key [key ...]
   * @Purpose Add multiple sets and store the resulting set in a key
   */
  SUNIONSTORE: ["SUNIONSTORE"],

  /**
   * @Usage XACK key group id [id ...]
   * @Purpose Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.
   */
  XACK: ["XACK"],

  /**
   * @Usage XADD key [NOMKSTREAM] [MAXLEN|MINID [=|~] threshold [LIMIT count]] *|id field value [field value ...]
   * @Purpose Appends a new entry to a stream
   */
  XADD: ["XADD"],

  /**
   * @Usage XAUTOCLAIM key group consumer min-idle-time start [COUNT count] [JUSTID]
   * @Purpose Changes (or acquires) ownership of messages in a consumer group, as if the messages were delivered to the specified consumer.
   */
  XAUTOCLAIM: ["XAUTOCLAIM"],

  /**
   * @Usage XCLAIM key group consumer min-idle-time id [id ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [FORCE] [JUSTID]
   * @Purpose Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.
   */
  XCLAIM: ["XCLAIM"],

  /**
   * @Usage XDEL key id [id ...]
   * @Purpose Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.
   */
  XDEL: ["XDEL"],

  /**
   * @Usage XGROUP CREATE key groupname id|$ [MKSTREAM]
   * @Purpose Create a consumer group.
   */
  XGROUP_CREATE: ["XGROUP", "CREATE"],

  /**
   * @Usage XGROUP CREATECONSUMER key groupname consumername
   * @Purpose Create a consumer in a consumer group.
   */
  XGROUP_CREATECONSUMER: ["XGROUP", "CREATECONSUMER"],

  /**
   * @Usage XGROUP DELCONSUMER key groupname consumername
   * @Purpose Delete a consumer from a consumer group.
   */
  XGROUP_DELCONSUMER: ["XGROUP", "DELCONSUMER"],

  /**
   * @Usage XGROUP DESTROY key groupname
   * @Purpose Destroy a consumer group.
   */
  XGROUP_DESTROY: ["XGROUP", "DESTROY"],

  /**
   * @Usage XGROUP SETID key groupname id|$
   * @Purpose Set a consumer group to an arbitrary last delivered ID value.
   */
  XGROUP_SETID: ["XGROUP", "SETID"],

  /**
   * @Usage XINFO CONSUMERS key groupname
   * @Purpose List the consumers in a consumer group
   */
  XINFO_CONSUMERS: ["XINFO", "CONSUMERS"],

  /**
   * @Usage XINFO GROUPS key
   * @Purpose List the consumer groups of a stream
   */
  XINFO_GROUPS: ["XINFO", "GROUPS"],

  /**
   * @Usage XINFO STREAM key [FULL [COUNT count]]
   * @Purpose Get information about a stream
   */
  XINFO_STREAM: ["XINFO", "STREAM"],

  /**
   * @Usage XLEN key
   * @Purpose Return the number of entries in a stream
   */
  XLEN: ["XLEN"],

  /**
   * @Usage XPENDING key group [[IDLE min-idle-time] start end count [consumer]]
   * @Purpose Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.
   */
  XPENDING: ["XPENDING"],

  /**
   * @Usage XRANGE key start end [COUNT count]
   * @Purpose Return a range of elements in a stream, with IDs matching the specified IDs interval
   */
  XRANGE: ["XRANGE"],

  /**
   * @Usage XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]
   * @Purpose Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.
   */
  XREAD: ["XREAD"],

  /**
   * @Usage XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] id [id ...]
   * @Purpose Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.
   */
  XREADGROUP: ["XREADGROUP"],

  /**
   * @Usage XREVRANGE key end start [COUNT count]
   * @Purpose Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE
   */
  XREVRANGE: ["XREVRANGE"],

  /**
   * @Usage XSETID key last-id
   * @Purpose An internal command for replicating stream values
   */
  XSETID: ["XSETID"],

  /**
   * @Usage XTRIM key MAXLEN|MINID [=|~] threshold [LIMIT count]
   * @Purpose Trims the stream to (approximately if '~' is passed) a certain size
   */
  XTRIM: ["XTRIM"],
}

/**
 * The redis commands organized in categories. 
 */
export const redisCommandsInCatgory = {

  server: {
    /**
     * @Usage ACL CAT [categoryname]
     * @Purpose List the ACL categories or the commands inside a category
     */
    ACL_CAT: ["ACL", "CAT"],

    /**
     * @Usage ACL DELUSER username [username ...]
     * @Purpose Remove the specified ACL users and the associated rules
     */
    ACL_DELUSER: ["ACL", "DELUSER"],

    /**
     * @Usage ACL GENPASS [bits]
     * @Purpose Generate a pseudorandom secure password to use for ACL users
     */
    ACL_GENPASS: ["ACL", "GENPASS"],

    /**
     * @Usage ACL GETUSER username
     * @Purpose Get the rules for a specific ACL user
     */
    ACL_GETUSER: ["ACL", "GETUSER"],

    /**
     * @Usage ACL LIST
     * @Purpose List the current ACL rules in ACL config file format
     */
    ACL_LIST: ["ACL", "LIST"],

    /**
     * @Usage ACL LOAD
     * @Purpose Reload the ACLs from the configured ACL file
     */
    ACL_LOAD: ["ACL", "LOAD"],

    /**
     * @Usage ACL LOG [count|RESET]
     * @Purpose List latest events denied because of ACLs in place
     */
    ACL_LOG: ["ACL", "LOG"],

    /**
     * @Usage ACL SAVE
     * @Purpose Save the current ACL rules in the configured ACL file
     */
    ACL_SAVE: ["ACL", "SAVE"],

    /**
     * @Usage ACL SETUSER username [rule [rule ...]]
     * @Purpose Modify or create the rules for a specific ACL user
     */
    ACL_SETUSER: ["ACL", "SETUSER"],

    /**
     * @Usage ACL USERS
     * @Purpose List the username of all the configured ACL rules
     */
    ACL_USERS: ["ACL", "USERS"],

    /**
     * @Usage ACL WHOAMI
     * @Purpose Return the name of the user associated to the current connection
     */
    ACL_WHOAMI: ["ACL", "WHOAMI"],

    /**
     * @Usage BGREWRITEAOF
     * @Purpose Asynchronously rewrite the append-only file
     */
    BGREWRITEAOF: ["BGREWRITEAOF"],

    /**
     * @Usage BGSAVE [SCHEDULE]
     * @Purpose Asynchronously save the dataset to disk
     */
    BGSAVE: ["BGSAVE"],

    /**
     * @Usage COMMAND
     * @Purpose Get array of Redis command details
     */
    COMMAND: ["COMMAND"],

    /**
     * @Usage COMMAND COUNT
     * @Purpose Get total number of Redis commands
     */
    COMMAND_COUNT: ["COMMAND", "COUNT"],

    /**
     * @Usage COMMAND GETKEYS
     * @Purpose Extract keys given a full Redis command
     */
    COMMAND_GETKEYS: ["COMMAND", "GETKEYS"],

    /**
     * @Usage COMMAND INFO command-name [command-name ...]
     * @Purpose Get array of specific Redis command details
     */
    COMMAND_INFO: ["COMMAND", "INFO"],

    /**
     * @Usage COMMAND LIST [FILTERBY MODULE module-name|ACLCAT category|PATTERN pattern]
     * @Purpose Get an array of Redis command names
     */
    COMMAND_LIST: ["COMMAND", "LIST"],

    /**
     * @Usage CONFIG GET parameter [parameter ...]
     * @Purpose Get the values of configuration parameters
     */
    CONFIG_GET: ["CONFIG", "GET"],

    /**
     * @Usage CONFIG RESETSTAT
     * @Purpose Reset the stats returned by INFO
     */
    CONFIG_RESETSTAT: ["CONFIG", "RESETSTAT"],

    /**
     * @Usage CONFIG REWRITE
     * @Purpose Rewrite the configuration file with the in memory configuration
     */
    CONFIG_REWRITE: ["CONFIG", "REWRITE"],

    /**
     * @Usage CONFIG SET parameter value [parameter value ...]
     * @Purpose Set configuration parameters to the given values
     */
    CONFIG_SET: ["CONFIG", "SET"],

    /**
     * @Usage DBSIZE
     * @Purpose Return the number of keys in the selected database
     */
    DBSIZE: ["DBSIZE"],

    /**
     * @Usage FAILOVER [TO host port [FORCE]] [ABORT] [TIMEOUT milliseconds]
     * @Purpose Start a coordinated failover between this server and one of its replicas.
     */
    FAILOVER: ["FAILOVER"],

    /**
     * @Usage FLUSHALL [ASYNC|SYNC]
     * @Purpose Remove all keys from all databases
     */
    FLUSHALL: ["FLUSHALL"],

    /**
     * @Usage FLUSHDB [ASYNC|SYNC]
     * @Purpose Remove all keys from the current database
     */
    FLUSHDB: ["FLUSHDB"],

    /**
     * @Usage INFO [section]
     * @Purpose Get information and statistics about the server
     */
    INFO: ["INFO"],

    /**
     * @Usage LASTSAVE
     * @Purpose Get the UNIX time stamp of the last successful save to disk
     */
    LASTSAVE: ["LASTSAVE"],

    /**
     * @Usage LATENCY DOCTOR
     * @Purpose Return a human readable latency analysis report.
     */
    LATENCY_DOCTOR: ["LATENCY", "DOCTOR"],

    /**
     * @Usage LATENCY GRAPH event
     * @Purpose Return a latency graph for the event.
     */
    LATENCY_GRAPH: ["LATENCY", "GRAPH"],

    /**
     * @Usage LATENCY HISTORY event
     * @Purpose Return timestamp-latency samples for the event.
     */
    LATENCY_HISTORY: ["LATENCY", "HISTORY"],

    /**
     * @Usage LATENCY LATEST
     * @Purpose Return the latest latency samples for all events.
     */
    LATENCY_LATEST: ["LATENCY", "LATEST"],

    /**
     * @Usage LATENCY RESET [event [event ...]]
     * @Purpose Reset latency data for one or more events.
     */
    LATENCY_RESET: ["LATENCY", "RESET"],

    /**
     * @Usage LOLWUT [VERSION version]
     * @Purpose Display some computer art and the Redis version
     */
    LOLWUT: ["LOLWUT"],

    /**
     * @Usage MEMORY DOCTOR
     * @Purpose Outputs memory problems report
     */
    MEMORY_DOCTOR: ["MEMORY", "DOCTOR"],

    /**
     * @Usage MEMORY MALLOC-STATS
     * @Purpose Show allocator internal stats
     */
    MEMORY_MALLOC_STATS: ["MEMORY", "MALLOC-STATS"],

    /**
     * @Usage MEMORY PURGE
     * @Purpose Ask the allocator to release memory
     */
    MEMORY_PURGE: ["MEMORY", "PURGE"],

    /**
     * @Usage MEMORY STATS
     * @Purpose Show memory usage details
     */
    MEMORY_STATS: ["MEMORY", "STATS"],

    /**
     * @Usage MEMORY USAGE key [SAMPLES count]
     * @Purpose Estimate the memory usage of a key
     */
    MEMORY_USAGE: ["MEMORY", "USAGE"],

    /**
     * @Usage MODULE LIST
     * @Purpose List all modules loaded by the server
     */
    MODULE_LIST: ["MODULE", "LIST"],

    /**
     * @Usage MODULE LOAD path [arg [arg ...]]
     * @Purpose Load a module
     */
    MODULE_LOAD: ["MODULE", "LOAD"],

    /**
     * @Usage MODULE UNLOAD name
     * @Purpose Unload a module
     */
    MODULE_UNLOAD: ["MODULE", "UNLOAD"],

    /**
     * @Usage MONITOR
     * @Purpose Listen for all requests received by the server in real time
     */
    MONITOR: ["MONITOR"],

    /**
     * @Usage PSYNC replicationid offset
     * @Purpose Internal command used for replication
     */
    PSYNC: ["PSYNC"],

    /**
     * @Usage REPLCONF
     * @Purpose An internal command for configuring the replication stream
     */
    REPLCONF: ["REPLCONF"],

    /**
     * @Usage REPLICAOF host port
     * @Purpose Make the server a replica of another instance, or promote it as master.
     */
    REPLICAOF: ["REPLICAOF"],

    /**
     * @Usage RESTORE-ASKING
     * @Purpose An internal command for migrating keys in a cluster
     */
    RESTORE_ASKING: ["RESTORE-ASKING"],

    /**
     * @Usage ROLE
     * @Purpose Return the role of the instance in the context of replication
     */
    ROLE: ["ROLE"],

    /**
     * @Usage SAVE
     * @Purpose Synchronously save the dataset to disk
     */
    SAVE: ["SAVE"],

    /**
     * @Usage SHUTDOWN [NOSAVE|SAVE] [NOW] [FORCE] [ABORT]
     * @Purpose Synchronously save the dataset to disk and then shut down the server
     */
    SHUTDOWN: ["SHUTDOWN"],

    /**
     * @Usage SLAVEOF host port
     * @Purpose Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.
     */
    SLAVEOF: ["SLAVEOF"],

    /**
     * @Usage SLOWLOG GET [count]
     * @Purpose Get the slow log's entries
     */
    SLOWLOG_GET: ["SLOWLOG", "GET"],

    /**
     * @Usage SLOWLOG LEN
     * @Purpose Get the slow log's length
     */
    SLOWLOG_LEN: ["SLOWLOG", "LEN"],

    /**
     * @Usage SLOWLOG RESET
     * @Purpose Clear all entries from the slow log
     */
    SLOWLOG_RESET: ["SLOWLOG", "RESET"],

    /**
     * @Usage SWAPDB index1 index2
     * @Purpose Swaps two Redis databases
     */
    SWAPDB: ["SWAPDB"],

    /**
     * @Usage SYNC
     * @Purpose Internal command used for replication
     */
    SYNC: ["SYNC"],

    /**
     * @Usage TIME
     * @Purpose Return the current server time
     */
    TIME: ["TIME"],
  },

  string: {
    /**
     * @Usage APPEND key value
     * @Purpose Append a value to a key
     */
    APPEND: ["APPEND"],

    /**
     * @Usage DECR key
     * @Purpose Decrement the integer value of a key by one
     */
    DECR: ["DECR"],

    /**
     * @Usage DECRBY key decrement
     * @Purpose Decrement the integer value of a key by the given number
     */
    DECRBY: ["DECRBY"],

    /**
     * @Usage GET key
     * @Purpose Get the value of a key
     */
    GET: ["GET"],

    /**
     * @Usage GETDEL key
     * @Purpose Get the value of a key and delete the key
     */
    GETDEL: ["GETDEL"],

    /**
     * @Usage GETEX key [EX seconds|PX milliseconds|EXAT unix-time|PXAT unix-time|PERSIST]
     * @Purpose Get the value of a key and optionally set its expiration
     */
    GETEX: ["GETEX"],

    /**
     * @Usage GETRANGE key start end
     * @Purpose Get a substring of the string stored at a key
     */
    GETRANGE: ["GETRANGE"],

    /**
     * @Usage GETSET key value
     * @Purpose Set the string value of a key and return its old value
     */
    GETSET: ["GETSET"],

    /**
     * @Usage INCR key
     * @Purpose Increment the integer value of a key by one
     */
    INCR: ["INCR"],

    /**
     * @Usage INCRBY key increment
     * @Purpose Increment the integer value of a key by the given amount
     */
    INCRBY: ["INCRBY"],

    /**
     * @Usage INCRBYFLOAT key increment
     * @Purpose Increment the float value of a key by the given amount
     */
    INCRBYFLOAT: ["INCRBYFLOAT"],

    /**
     * @Usage LCS key1 key2 [LEN] [IDX] [MINMATCHLEN len] [WITHMATCHLEN]
     * @Purpose Find longest common substring
     */
    LCS: ["LCS"],

    /**
     * @Usage MGET key [key ...]
     * @Purpose Get the values of all the given keys
     */
    MGET: ["MGET"],

    /**
     * @Usage MSET key value [key value ...]
     * @Purpose Set multiple keys to multiple values
     */
    MSET: ["MSET"],

    /**
     * @Usage MSETNX key value [key value ...]
     * @Purpose Set multiple keys to multiple values, only if none of the keys exist
     */
    MSETNX: ["MSETNX"],

    /**
     * @Usage PSETEX key milliseconds value
     * @Purpose Set the value and expiration in milliseconds of a key
     */
    PSETEX: ["PSETEX"],

    /**
     * @Usage SET key value [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL] [NX|XX] [GET]
     * @Purpose Set the string value of a key
     */
    SET: ["SET"],

    /**
     * @Usage SETEX key seconds value
     * @Purpose Set the value and expiration of a key
     */
    SETEX: ["SETEX"],

    /**
     * @Usage SETNX key value
     * @Purpose Set the value of a key, only if the key does not exist
     */
    SETNX: ["SETNX"],

    /**
     * @Usage SETRANGE key offset value
     * @Purpose Overwrite part of a string at key starting at the specified offset
     */
    SETRANGE: ["SETRANGE"],

    /**
     * @Usage STRLEN key
     * @Purpose Get the length of the value stored in a key
     */
    STRLEN: ["STRLEN"],

    /**
     * @Usage SUBSTR key start end
     * @Purpose Get a substring of the string stored at a key
     */
    SUBSTR: ["SUBSTR"],
  },

  cluster: {
    /**
     * @Usage ASKING
     * @Purpose Sent by cluster clients after an -ASK redirect
     */
    ASKING: ["ASKING"],

    /**
     * @Usage CLUSTER ADDSLOTS slot [slot ...]
     * @Purpose Assign new hash slots to receiving node
     */
    CLUSTER_ADDSLOTS: ["CLUSTER", "ADDSLOTS"],

    /**
     * @Usage CLUSTER ADDSLOTSRANGE start-slot end-slot [start-slot end-slot ...]
     * @Purpose Assign new hash slots to receiving node
     */
    CLUSTER_ADDSLOTSRANGE: ["CLUSTER", "ADDSLOTSRANGE"],

    /**
     * @Usage CLUSTER BUMPEPOCH
     * @Purpose Advance the cluster config epoch
     */
    CLUSTER_BUMPEPOCH: ["CLUSTER", "BUMPEPOCH"],

    /**
     * @Usage CLUSTER COUNT-FAILURE-REPORTS node-id
     * @Purpose Return the number of failure reports active for a given node
     */
    CLUSTER_COUNT_FAILURE_REPORTS: ["CLUSTER", "COUNT-FAILURE-REPORTS"],

    /**
     * @Usage CLUSTER COUNTKEYSINSLOT slot
     * @Purpose Return the number of local keys in the specified hash slot
     */
    CLUSTER_COUNTKEYSINSLOT: ["CLUSTER", "COUNTKEYSINSLOT"],

    /**
     * @Usage CLUSTER DELSLOTS slot [slot ...]
     * @Purpose Set hash slots as unbound in receiving node
     */
    CLUSTER_DELSLOTS: ["CLUSTER", "DELSLOTS"],

    /**
     * @Usage CLUSTER DELSLOTSRANGE start-slot end-slot [start-slot end-slot ...]
     * @Purpose Set hash slots as unbound in receiving node
     */
    CLUSTER_DELSLOTSRANGE: ["CLUSTER", "DELSLOTSRANGE"],

    /**
     * @Usage CLUSTER FAILOVER [FORCE|TAKEOVER]
     * @Purpose Forces a replica to perform a manual failover of its master.
     */
    CLUSTER_FAILOVER: ["CLUSTER", "FAILOVER"],

    /**
     * @Usage CLUSTER FLUSHSLOTS
     * @Purpose Delete a node's own slots information
     */
    CLUSTER_FLUSHSLOTS: ["CLUSTER", "FLUSHSLOTS"],

    /**
     * @Usage CLUSTER FORGET node-id
     * @Purpose Remove a node from the nodes table
     */
    CLUSTER_FORGET: ["CLUSTER", "FORGET"],

    /**
     * @Usage CLUSTER GETKEYSINSLOT slot count
     * @Purpose Return local key names in the specified hash slot
     */
    CLUSTER_GETKEYSINSLOT: ["CLUSTER", "GETKEYSINSLOT"],

    /**
     * @Usage CLUSTER INFO
     * @Purpose Provides info about Redis Cluster node state
     */
    CLUSTER_INFO: ["CLUSTER", "INFO"],

    /**
     * @Usage CLUSTER KEYSLOT key
     * @Purpose Returns the hash slot of the specified key
     */
    CLUSTER_KEYSLOT: ["CLUSTER", "KEYSLOT"],

    /**
     * @Usage CLUSTER LINKS
     * @Purpose Returns a list of all TCP links to and from peer nodes in cluster
     */
    CLUSTER_LINKS: ["CLUSTER", "LINKS"],

    /**
     * @Usage CLUSTER MEET ip port
     * @Purpose Force a node cluster to handshake with another node
     */
    CLUSTER_MEET: ["CLUSTER", "MEET"],

    /**
     * @Usage CLUSTER MYID
     * @Purpose Return the node id
     */
    CLUSTER_MYID: ["CLUSTER", "MYID"],

    /**
     * @Usage CLUSTER NODES
     * @Purpose Get Cluster config for the node
     */
    CLUSTER_NODES: ["CLUSTER", "NODES"],

    /**
     * @Usage CLUSTER REPLICAS node-id
     * @Purpose List replica nodes of the specified master node
     */
    CLUSTER_REPLICAS: ["CLUSTER", "REPLICAS"],

    /**
     * @Usage CLUSTER REPLICATE node-id
     * @Purpose Reconfigure a node as a replica of the specified master node
     */
    CLUSTER_REPLICATE: ["CLUSTER", "REPLICATE"],

    /**
     * @Usage CLUSTER RESET [HARD|SOFT]
     * @Purpose Reset a Redis Cluster node
     */
    CLUSTER_RESET: ["CLUSTER", "RESET"],

    /**
     * @Usage CLUSTER SAVECONFIG
     * @Purpose Forces the node to save cluster state on disk
     */
    CLUSTER_SAVECONFIG: ["CLUSTER", "SAVECONFIG"],

    /**
     * @Usage CLUSTER SET-CONFIG-EPOCH config-epoch
     * @Purpose Set the configuration epoch in a new node
     */
    CLUSTER_SET_CONFIG_EPOCH: ["CLUSTER", "SET-CONFIG-EPOCH"],

    /**
     * @Usage CLUSTER SETSLOT slot IMPORTING node-id|MIGRATING node-id|NODE node-id|STABLE
     * @Purpose Bind a hash slot to a specific node
     */
    CLUSTER_SETSLOT: ["CLUSTER", "SETSLOT"],

    /**
     * @Usage CLUSTER SLAVES node-id
     * @Purpose List replica nodes of the specified master node
     */
    CLUSTER_SLAVES: ["CLUSTER", "SLAVES"],

    /**
     * @Usage CLUSTER SLOTS
     * @Purpose Get array of Cluster slot to node mappings
     */
    CLUSTER_SLOTS: ["CLUSTER", "SLOTS"],

    /**
     * @Usage READONLY
     * @Purpose Enables read queries for a connection to a cluster replica node
     */
    READONLY: ["READONLY"],

    /**
     * @Usage READWRITE
     * @Purpose Disables read queries for a connection to a cluster replica node
     */
    READWRITE: ["READWRITE"],
  },

  connection: {
    /**
     * @Usage AUTH [username] password
     * @Purpose Authenticate to the server
     */
    AUTH: ["AUTH"],

    /**
     * @Usage CLIENT CACHING YES|NO
     * @Purpose Instruct the server about tracking or not keys in the next request
     */
    CLIENT_CACHING: ["CLIENT", "CACHING"],

    /**
     * @Usage CLIENT GETNAME
     * @Purpose Get the current connection name
     */
    CLIENT_GETNAME: ["CLIENT", "GETNAME"],

    /**
     * @Usage CLIENT GETREDIR
     * @Purpose Get tracking notifications redirection client ID if any
     */
    CLIENT_GETREDIR: ["CLIENT", "GETREDIR"],

    /**
     * @Usage CLIENT ID
     * @Purpose Returns the client ID for the current connection
     */
    CLIENT_ID: ["CLIENT", "ID"],

    /**
     * @Usage CLIENT INFO
     * @Purpose Returns information about the current client connection.
     */
    CLIENT_INFO: ["CLIENT", "INFO"],

    /**
     * @Usage CLIENT KILL [ip:port] [ID client-id] [TYPE NORMAL|MASTER|SLAVE|REPLICA|PUBSUB] [USER username] [ADDR ip:port] [LADDR ip:port] [SKIPME yes/no]
     * @Purpose Kill the connection of a client
     */
    CLIENT_KILL: ["CLIENT", "KILL"],

    /**
     * @Usage CLIENT LIST [TYPE NORMAL|MASTER|REPLICA|PUBSUB] [ID client-id [client-id ...]]
     * @Purpose Get the list of client connections
     */
    CLIENT_LIST: ["CLIENT", "LIST"],

    /**
     * @Usage CLIENT NO-EVICT ON|OFF
     * @Purpose Set client eviction mode for the current connection
     */
    CLIENT_NO_EVICT: ["CLIENT", "NO-EVICT"],

    /**
     * @Usage CLIENT PAUSE timeout [WRITE|ALL]
     * @Purpose Stop processing commands from clients for some time
     */
    CLIENT_PAUSE: ["CLIENT", "PAUSE"],

    /**
     * @Usage CLIENT REPLY ON|OFF|SKIP
     * @Purpose Instruct the server whether to reply to commands
     */
    CLIENT_REPLY: ["CLIENT", "REPLY"],

    /**
     * @Usage CLIENT SETNAME connection-name
     * @Purpose Set the current connection name
     */
    CLIENT_SETNAME: ["CLIENT", "SETNAME"],

    /**
     * @Usage CLIENT TRACKING ON|OFF [REDIRECT client-id] [PREFIX prefix [PREFIX prefix ...]] [BCAST] [OPTIN] [OPTOUT] [NOLOOP]
     * @Purpose Enable or disable server assisted client side caching support
     */
    CLIENT_TRACKING: ["CLIENT", "TRACKING"],

    /**
     * @Usage CLIENT TRACKINGINFO
     * @Purpose Return information about server assisted client side caching for the current connection
     */
    CLIENT_TRACKINGINFO: ["CLIENT", "TRACKINGINFO"],

    /**
     * @Usage CLIENT UNBLOCK client-id [TIMEOUT|ERROR]
     * @Purpose Unblock a client blocked in a blocking command from a different connection
     */
    CLIENT_UNBLOCK: ["CLIENT", "UNBLOCK"],

    /**
     * @Usage CLIENT UNPAUSE
     * @Purpose Resume processing of clients that were paused
     */
    CLIENT_UNPAUSE: ["CLIENT", "UNPAUSE"],

    /**
     * @Usage ECHO message
     * @Purpose Echo the given string
     */
    ECHO: ["ECHO"],

    /**
     * @Usage HELLO [protover [AUTH username password] [SETNAME clientname]]
     * @Purpose Handshake with Redis
     */
    HELLO: ["HELLO"],

    /**
     * @Usage PING [message]
     * @Purpose Ping the server
     */
    PING: ["PING"],

    /**
     * @Usage QUIT
     * @Purpose Close the connection
     */
    QUIT: ["QUIT"],

    /**
     * @Usage RESET
     * @Purpose Reset the connection
     */
    RESET: ["RESET"],

    /**
     * @Usage SELECT index
     * @Purpose Change the selected database for the current connection
     */
    SELECT: ["SELECT"],
  },

  bitmap: {
    /**
     * @Usage BITCOUNT key [start end [BYTE|BIT]]
     * @Purpose Count set bits in a string
     */
    BITCOUNT: ["BITCOUNT"],

    /**
     * @Usage BITFIELD key [GET encoding offset] [SET encoding offset value] [INCRBY encoding offset increment] [OVERFLOW WRAP|SAT|FAIL]
     * @Purpose Perform arbitrary bitfield integer operations on strings
     */
    BITFIELD: ["BITFIELD"],

    /**
     * @Usage BITFIELD_RO key GET encoding offset
     * @Purpose Perform arbitrary bitfield integer operations on strings. Read-only variant of BITFIELD
     */
    BITFIELD_RO: ["BITFIELD_RO"],

    /**
     * @Usage BITOP operation destkey key [key ...]
     * @Purpose Perform bitwise operations between strings
     */
    BITOP: ["BITOP"],

    /**
     * @Usage BITPOS key bit [start [end [BYTE|BIT]]]
     * @Purpose Find first bit set or clear in a string
     */
    BITPOS: ["BITPOS"],

    /**
     * @Usage GETBIT key offset
     * @Purpose Returns the bit value at offset in the string value stored at key
     */
    GETBIT: ["GETBIT"],

    /**
     * @Usage SETBIT key offset value
     * @Purpose Sets or clears the bit at offset in the string value stored at key
     */
    SETBIT: ["SETBIT"],
  },

  list: {
    /**
     * @Usage BLMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout
     * @Purpose Pop an element from a list, push it to another list and return it; or block until one is available
     */
    BLMOVE: ["BLMOVE"],

    /**
     * @Usage BLMPOP timeout numkeys key [key ...] LEFT|RIGHT [COUNT count]
     * @Purpose Pop elements from a list, or block until one is available
     */
    BLMPOP: ["BLMPOP"],

    /**
     * @Usage BLPOP key [key ...] timeout
     * @Purpose Remove and get the first element in a list, or block until one is available
     */
    BLPOP: ["BLPOP"],

    /**
     * @Usage BRPOP key [key ...] timeout
     * @Purpose Remove and get the last element in a list, or block until one is available
     */
    BRPOP: ["BRPOP"],

    /**
     * @Usage BRPOPLPUSH source destination timeout
     * @Purpose Pop an element from a list, push it to another list and return it; or block until one is available
     */
    BRPOPLPUSH: ["BRPOPLPUSH"],

    /**
     * @Usage LINDEX key index
     * @Purpose Get an element from a list by its index
     */
    LINDEX: ["LINDEX"],

    /**
     * @Usage LINSERT key BEFORE|AFTER pivot element
     * @Purpose Insert an element before or after another element in a list
     */
    LINSERT: ["LINSERT"],

    /**
     * @Usage LLEN key
     * @Purpose Get the length of a list
     */
    LLEN: ["LLEN"],

    /**
     * @Usage LMOVE source destination LEFT|RIGHT LEFT|RIGHT
     * @Purpose Pop an element from a list, push it to another list and return it
     */
    LMOVE: ["LMOVE"],

    /**
     * @Usage LMPOP numkeys key [key ...] LEFT|RIGHT [COUNT count]
     * @Purpose Pop elements from a list
     */
    LMPOP: ["LMPOP"],

    /**
     * @Usage LPOP key [count]
     * @Purpose Remove and get the first elements in a list
     */
    LPOP: ["LPOP"],

    /**
     * @Usage LPOS key element [RANK rank] [COUNT num-matches] [MAXLEN len]
     * @Purpose Return the index of matching elements on a list
     */
    LPOS: ["LPOS"],

    /**
     * @Usage LPUSH key element [element ...]
     * @Purpose Prepend one or multiple elements to a list
     */
    LPUSH: ["LPUSH"],

    /**
     * @Usage LPUSHX key element [element ...]
     * @Purpose Prepend an element to a list, only if the list exists
     */
    LPUSHX: ["LPUSHX"],

    /**
     * @Usage LRANGE key start stop
     * @Purpose Get a range of elements from a list
     */
    LRANGE: ["LRANGE"],

    /**
     * @Usage LREM key count element
     * @Purpose Remove elements from a list
     */
    LREM: ["LREM"],

    /**
     * @Usage LSET key index element
     * @Purpose Set the value of an element in a list by its index
     */
    LSET: ["LSET"],

    /**
     * @Usage LTRIM key start stop
     * @Purpose Trim a list to the specified range
     */
    LTRIM: ["LTRIM"],

    /**
     * @Usage RPOP key [count]
     * @Purpose Remove and get the last elements in a list
     */
    RPOP: ["RPOP"],

    /**
     * @Usage RPOPLPUSH source destination
     * @Purpose Remove the last element in a list, prepend it to another list and return it
     */
    RPOPLPUSH: ["RPOPLPUSH"],

    /**
     * @Usage RPUSH key element [element ...]
     * @Purpose Append one or multiple elements to a list
     */
    RPUSH: ["RPUSH"],

    /**
     * @Usage RPUSHX key element [element ...]
     * @Purpose Append an element to a list, only if the list exists
     */
    RPUSHX: ["RPUSHX"],
  },

  sortedSet: {
    /**
     * @Usage BZMPOP timeout numkeys key [key ...] MIN|MAX [COUNT count]
     * @Purpose Remove and return members with scores in a sorted set or block until one is available
     */
    BZMPOP: ["BZMPOP"],

    /**
     * @Usage BZPOPMAX key [key ...] timeout
     * @Purpose Remove and return the member with the highest score from one or more sorted sets, or block until one is available
     */
    BZPOPMAX: ["BZPOPMAX"],

    /**
     * @Usage BZPOPMIN key [key ...] timeout
     * @Purpose Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
     */
    BZPOPMIN: ["BZPOPMIN"],

    /**
     * @Usage ZADD key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]
     * @Purpose Add one or more members to a sorted set, or update its score if it already exists
     */
    ZADD: ["ZADD"],

    /**
     * @Usage ZCARD key
     * @Purpose Get the number of members in a sorted set
     */
    ZCARD: ["ZCARD"],

    /**
     * @Usage ZCOUNT key min max
     * @Purpose Count the members in a sorted set with scores within the given values
     */
    ZCOUNT: ["ZCOUNT"],

    /**
     * @Usage ZDIFF numkeys key [key ...] [WITHSCORES]
     * @Purpose Subtract multiple sorted sets
     */
    ZDIFF: ["ZDIFF"],

    /**
     * @Usage ZDIFFSTORE destination numkeys key [key ...]
     * @Purpose Subtract multiple sorted sets and store the resulting sorted set in a new key
     */
    ZDIFFSTORE: ["ZDIFFSTORE"],

    /**
     * @Usage ZINCRBY key increment member
     * @Purpose Increment the score of a member in a sorted set
     */
    ZINCRBY: ["ZINCRBY"],

    /**
     * @Usage ZINTER numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
     * @Purpose Intersect multiple sorted sets
     */
    ZINTER: ["ZINTER"],

    /**
     * @Usage ZINTERCARD numkeys key [key ...] [LIMIT limit]
     * @Purpose Intersect multiple sorted sets and return the cardinality of the result
     */
    ZINTERCARD: ["ZINTERCARD"],

    /**
     * @Usage ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
     * @Purpose Intersect multiple sorted sets and store the resulting sorted set in a new key
     */
    ZINTERSTORE: ["ZINTERSTORE"],

    /**
     * @Usage ZLEXCOUNT key min max
     * @Purpose Count the number of members in a sorted set between a given lexicographical range
     */
    ZLEXCOUNT: ["ZLEXCOUNT"],

    /**
     * @Usage ZMPOP numkeys key [key ...] MIN|MAX [COUNT count]
     * @Purpose Remove and return members with scores in a sorted set
     */
    ZMPOP: ["ZMPOP"],

    /**
     * @Usage ZMSCORE key member [member ...]
     * @Purpose Get the score associated with the given members in a sorted set
     */
    ZMSCORE: ["ZMSCORE"],

    /**
     * @Usage ZPOPMAX key [count]
     * @Purpose Remove and return members with the highest scores in a sorted set
     */
    ZPOPMAX: ["ZPOPMAX"],

    /**
     * @Usage ZPOPMIN key [count]
     * @Purpose Remove and return members with the lowest scores in a sorted set
     */
    ZPOPMIN: ["ZPOPMIN"],

    /**
     * @Usage ZRANDMEMBER key [count [WITHSCORES]]
     * @Purpose Get one or multiple random elements from a sorted set
     */
    ZRANDMEMBER: ["ZRANDMEMBER"],

    /**
     * @Usage ZRANGE key min max [BYSCORE|BYLEX] [REV] [LIMIT offset count] [WITHSCORES]
     * @Purpose Return a range of members in a sorted set
     */
    ZRANGE: ["ZRANGE"],

    /**
     * @Usage ZRANGEBYLEX key min max [LIMIT offset count]
     * @Purpose Return a range of members in a sorted set, by lexicographical range
     */
    ZRANGEBYLEX: ["ZRANGEBYLEX"],

    /**
     * @Usage ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
     * @Purpose Return a range of members in a sorted set, by score
     */
    ZRANGEBYSCORE: ["ZRANGEBYSCORE"],

    /**
     * @Usage ZRANGESTORE dst src min max [BYSCORE|BYLEX] [REV] [LIMIT offset count]
     * @Purpose Store a range of members from sorted set into another key
     */
    ZRANGESTORE: ["ZRANGESTORE"],

    /**
     * @Usage ZRANK key member
     * @Purpose Determine the index of a member in a sorted set
     */
    ZRANK: ["ZRANK"],

    /**
     * @Usage ZREM key member [member ...]
     * @Purpose Remove one or more members from a sorted set
     */
    ZREM: ["ZREM"],

    /**
     * @Usage ZREMRANGEBYLEX key min max
     * @Purpose Remove all members in a sorted set between the given lexicographical range
     */
    ZREMRANGEBYLEX: ["ZREMRANGEBYLEX"],

    /**
     * @Usage ZREMRANGEBYRANK key start stop
     * @Purpose Remove all members in a sorted set within the given indexes
     */
    ZREMRANGEBYRANK: ["ZREMRANGEBYRANK"],

    /**
     * @Usage ZREMRANGEBYSCORE key min max
     * @Purpose Remove all members in a sorted set within the given scores
     */
    ZREMRANGEBYSCORE: ["ZREMRANGEBYSCORE"],

    /**
     * @Usage ZREVRANGE key start stop [WITHSCORES]
     * @Purpose Return a range of members in a sorted set, by index, with scores ordered from high to low
     */
    ZREVRANGE: ["ZREVRANGE"],

    /**
     * @Usage ZREVRANGEBYLEX key max min [LIMIT offset count]
     * @Purpose Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
     */
    ZREVRANGEBYLEX: ["ZREVRANGEBYLEX"],

    /**
     * @Usage ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
     * @Purpose Return a range of members in a sorted set, by score, with scores ordered from high to low
     */
    ZREVRANGEBYSCORE: ["ZREVRANGEBYSCORE"],

    /**
     * @Usage ZREVRANK key member
     * @Purpose Determine the index of a member in a sorted set, with scores ordered from high to low
     */
    ZREVRANK: ["ZREVRANK"],

    /**
     * @Usage ZSCAN key cursor [MATCH pattern] [COUNT count]
     * @Purpose Incrementally iterate sorted sets elements and associated scores
     */
    ZSCAN: ["ZSCAN"],

    /**
     * @Usage ZSCORE key member
     * @Purpose Get the score associated with the given member in a sorted set
     */
    ZSCORE: ["ZSCORE"],

    /**
     * @Usage ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
     * @Purpose Add multiple sorted sets
     */
    ZUNION: ["ZUNION"],

    /**
     * @Usage ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
     * @Purpose Add multiple sorted sets and store the resulting sorted set in a new key
     */
    ZUNIONSTORE: ["ZUNIONSTORE"],
  },

  generic: {
    /**
     * @Usage COPY source destination [DB destination-db] [REPLACE]
     * @Purpose Copy a key
     */
    COPY: ["COPY"],

    /**
     * @Usage DEL key [key ...]
     * @Purpose Delete a key
     */
    DEL: ["DEL"],

    /**
     * @Usage DUMP key
     * @Purpose Return a serialized version of the value stored at the specified key.
     */
    DUMP: ["DUMP"],

    /**
     * @Usage EXISTS key [key ...]
     * @Purpose Determine if a key exists
     */
    EXISTS: ["EXISTS"],

    /**
     * @Usage EXPIRE key seconds [NX|XX|GT|LT]
     * @Purpose Set a key's time to live in seconds
     */
    EXPIRE: ["EXPIRE"],

    /**
     * @Usage EXPIREAT key timestamp [NX|XX|GT|LT]
     * @Purpose Set the expiration for a key as a UNIX timestamp
     */
    EXPIREAT: ["EXPIREAT"],

    /**
     * @Usage EXPIRETIME key
     * @Purpose Get the expiration Unix timestamp for a key
     */
    EXPIRETIME: ["EXPIRETIME"],

    /**
     * @Usage KEYS pattern
     * @Purpose Find all keys matching the given pattern
     */
    KEYS: ["KEYS"],

    /**
     * @Usage MIGRATE host port key|"" destination-db timeout [COPY] [REPLACE] [AUTH password] [AUTH2 username password] [KEYS key [key ...]]
     * @Purpose Atomically transfer a key from a Redis instance to another one.
     */
    MIGRATE: ["MIGRATE"],

    /**
     * @Usage MOVE key db
     * @Purpose Move a key to another database
     */
    MOVE: ["MOVE"],

    /**
     * @Usage OBJECT ENCODING key
     * @Purpose Inspect the internal encoding of a Redis object
     */
    OBJECT_ENCODING: ["OBJECT", "ENCODING"],

    /**
     * @Usage OBJECT FREQ key
     * @Purpose Get the logarithmic access frequency counter of a Redis object
     */
    OBJECT_FREQ: ["OBJECT", "FREQ"],

    /**
     * @Usage OBJECT IDLETIME key
     * @Purpose Get the time since a Redis object was last accessed
     */
    OBJECT_IDLETIME: ["OBJECT", "IDLETIME"],

    /**
     * @Usage OBJECT REFCOUNT key
     * @Purpose Get the number of references to the value of the key
     */
    OBJECT_REFCOUNT: ["OBJECT", "REFCOUNT"],

    /**
     * @Usage PERSIST key
     * @Purpose Remove the expiration from a key
     */
    PERSIST: ["PERSIST"],

    /**
     * @Usage PEXPIRE key milliseconds [NX|XX|GT|LT]
     * @Purpose Set a key's time to live in milliseconds
     */
    PEXPIRE: ["PEXPIRE"],

    /**
     * @Usage PEXPIREAT key milliseconds-timestamp [NX|XX|GT|LT]
     * @Purpose Set the expiration for a key as a UNIX timestamp specified in milliseconds
     */
    PEXPIREAT: ["PEXPIREAT"],

    /**
     * @Usage PEXPIRETIME key
     * @Purpose Get the expiration Unix timestamp for a key in milliseconds
     */
    PEXPIRETIME: ["PEXPIRETIME"],

    /**
     * @Usage PTTL key
     * @Purpose Get the time to live for a key in milliseconds
     */
    PTTL: ["PTTL"],

    /**
     * @Usage RANDOMKEY
     * @Purpose Return a random key from the keyspace
     */
    RANDOMKEY: ["RANDOMKEY"],

    /**
     * @Usage RENAME key newkey
     * @Purpose Rename a key
     */
    RENAME: ["RENAME"],

    /**
     * @Usage RENAMENX key newkey
     * @Purpose Rename a key, only if the new key does not exist
     */
    RENAMENX: ["RENAMENX"],

    /**
     * @Usage RESTORE key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]
     * @Purpose Create a key using the provided serialized value, previously obtained using DUMP.
     */
    RESTORE: ["RESTORE"],

    /**
     * @Usage SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]
     * @Purpose Incrementally iterate the keys space
     */
    SCAN: ["SCAN"],

    /**
     * @Usage SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
     * @Purpose Sort the elements in a list, set or sorted set
     */
    SORT: ["SORT"],

    /**
     * @Usage SORT_RO key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA]
     * @Purpose Sort the elements in a list, set or sorted set. Read-only variant of SORT.
     */
    SORT_RO: ["SORT_RO"],

    /**
     * @Usage TOUCH key [key ...]
     * @Purpose Alters the last access time of a key(s). Returns the number of existing keys specified.
     */
    TOUCH: ["TOUCH"],

    /**
     * @Usage TTL key
     * @Purpose Get the time to live for a key in seconds
     */
    TTL: ["TTL"],

    /**
     * @Usage TYPE key
     * @Purpose Determine the type stored at key
     */
    TYPE: ["TYPE"],

    /**
     * @Usage UNLINK key [key ...]
     * @Purpose Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
     */
    UNLINK: ["UNLINK"],

    /**
     * @Usage WAIT numreplicas timeout
     * @Purpose Wait for the synchronous replication of all the write commands sent in the context of the current connection
     */
    WAIT: ["WAIT"],
  },

  transactions: {
    /**
     * @Usage DISCARD
     * @Purpose Discard all commands issued after MULTI
     */
    DISCARD: ["DISCARD"],

    /**
     * @Usage EXEC
     * @Purpose Execute all commands issued after MULTI
     */
    EXEC: ["EXEC"],

    /**
     * @Usage MULTI
     * @Purpose Mark the start of a transaction block
     */
    MULTI: ["MULTI"],

    /**
     * @Usage UNWATCH
     * @Purpose Forget about all watched keys
     */
    UNWATCH: ["UNWATCH"],

    /**
     * @Usage WATCH key [key ...]
     * @Purpose Watch the given keys to determine execution of the MULTI/EXEC block
     */
    WATCH: ["WATCH"],
  },

  scripting: {
    /**
     * @Usage EVAL script numkeys [key [key ...]] [arg [arg ...]]
     * @Purpose Execute a Lua script server side
     */
    EVAL: ["EVAL"],

    /**
     * @Usage EVALSHA sha1 numkeys [key [key ...]] [arg [arg ...]]
     * @Purpose Execute a Lua script server side
     */
    EVALSHA: ["EVALSHA"],

    /**
     * @Usage EVALSHA_RO sha1 numkeys key [key ...] arg [arg ...]
     * @Purpose Execute a read-only Lua script server side
     */
    EVALSHA_RO: ["EVALSHA_RO"],

    /**
     * @Usage EVAL_RO script numkeys key [key ...] arg [arg ...]
     * @Purpose Execute a read-only Lua script server side
     */
    EVAL_RO: ["EVAL_RO"],

    /**
     * @Usage FCALL function numkeys key [key ...] arg [arg ...]
     * @Purpose PATCH__TBD__38__
     */
    FCALL: ["FCALL"],

    /**
     * @Usage FCALL_RO function numkeys key [key ...] arg [arg ...]
     * @Purpose PATCH__TBD__7__
     */
    FCALL_RO: ["FCALL_RO"],

    /**
     * @Usage FUNCTION CREATE engine-name function-name [REPLACE] [DESC function-description] function-code
     * @Purpose Create a function with the given arguments (name, code, description)
     */
    FUNCTION_CREATE: ["FUNCTION", "CREATE"],

    /**
     * @Usage FUNCTION DELETE function-name
     * @Purpose Delete a function by name
     */
    FUNCTION_DELETE: ["FUNCTION", "DELETE"],

    /**
     * @Usage FUNCTION DUMP
     * @Purpose Dump all functions into a serialized binary payload
     */
    FUNCTION_DUMP: ["FUNCTION", "DUMP"],

    /**
     * @Usage FUNCTION FLUSH [ASYNC|SYNC]
     * @Purpose Deleting all functions
     */
    FUNCTION_FLUSH: ["FUNCTION", "FLUSH"],

    /**
     * @Usage FUNCTION INFO function-name [WITHCODE]
     * @Purpose Return information about a function by function name
     */
    FUNCTION_INFO: ["FUNCTION", "INFO"],

    /**
     * @Usage FUNCTION KILL
     * @Purpose Kill the function currently in execution.
     */
    FUNCTION_KILL: ["FUNCTION", "KILL"],

    /**
     * @Usage FUNCTION LIST
     * @Purpose List information about all the functions
     */
    FUNCTION_LIST: ["FUNCTION", "LIST"],

    /**
     * @Usage FUNCTION RESTORE serialized-value [FLUSH|APPEND|REPLACE]
     * @Purpose Restore all the functions on the given payload
     */
    FUNCTION_RESTORE: ["FUNCTION", "RESTORE"],

    /**
     * @Usage FUNCTION STATS
     * @Purpose Return information about the function currently running (name, description, duration)
     */
    FUNCTION_STATS: ["FUNCTION", "STATS"],

    /**
     * @Usage SCRIPT DEBUG YES|SYNC|NO
     * @Purpose Set the debug mode for executed scripts.
     */
    SCRIPT_DEBUG: ["SCRIPT", "DEBUG"],

    /**
     * @Usage SCRIPT EXISTS sha1 [sha1 ...]
     * @Purpose Check existence of scripts in the script cache.
     */
    SCRIPT_EXISTS: ["SCRIPT", "EXISTS"],

    /**
     * @Usage SCRIPT FLUSH [ASYNC|SYNC]
     * @Purpose Remove all the scripts from the script cache.
     */
    SCRIPT_FLUSH: ["SCRIPT", "FLUSH"],

    /**
     * @Usage SCRIPT KILL
     * @Purpose Kill the script currently in execution.
     */
    SCRIPT_KILL: ["SCRIPT", "KILL"],

    /**
     * @Usage SCRIPT LOAD script
     * @Purpose Load the specified Lua script into the script cache.
     */
    SCRIPT_LOAD: ["SCRIPT", "LOAD"],
  },

  geo: {
    /**
     * @Usage GEOADD key [NX|XX] [CH] longitude latitude member [longitude latitude member ...]
     * @Purpose Add one or more geospatial items in the geospatial index represented using a sorted set
     */
    GEOADD: ["GEOADD"],

    /**
     * @Usage GEODIST key member1 member2 [M|KM|FT|MI]
     * @Purpose Returns the distance between two members of a geospatial index
     */
    GEODIST: ["GEODIST"],

    /**
     * @Usage GEOHASH key member [member ...]
     * @Purpose Returns members of a geospatial index as standard geohash strings
     */
    GEOHASH: ["GEOHASH"],

    /**
     * @Usage GEOPOS key member [member ...]
     * @Purpose Returns longitude and latitude of members of a geospatial index
     */
    GEOPOS: ["GEOPOS"],

    /**
     * @Usage GEORADIUS key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key] [STOREDIST key]
     * @Purpose Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point
     */
    GEORADIUS: ["GEORADIUS"],

    /**
     * @Usage GEORADIUSBYMEMBER key member radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC] [STORE key] [STOREDIST key]
     * @Purpose Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member
     */
    GEORADIUSBYMEMBER: ["GEORADIUSBYMEMBER"],

    /**
     * @Usage GEORADIUSBYMEMBER_RO key member radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC]
     * @Purpose A read-only variant for GEORADIUSBYMEMBER
     */
    GEORADIUSBYMEMBER_RO: ["GEORADIUSBYMEMBER_RO"],

    /**
     * @Usage GEORADIUS_RO key longitude latitude radius M|KM|FT|MI [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count [ANY]] [ASC|DESC]
     * @Purpose A read-only variant for GEORADIUS
     */
    GEORADIUS_RO: ["GEORADIUS_RO"],

    /**
     * @Usage GEOSEARCH key [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius M|KM|FT|MI] [BYBOX width height M|KM|FT|MI] [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH]
     * @Purpose Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle.
     */
    GEOSEARCH: ["GEOSEARCH"],

    /**
     * @Usage GEOSEARCHSTORE destination source [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius M|KM|FT|MI] [BYBOX width height M|KM|FT|MI] [ASC|DESC] [COUNT count [ANY]] [STOREDIST]
     * @Purpose Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle, and store the result in another key.
     */
    GEOSEARCHSTORE: ["GEOSEARCHSTORE"],
  },

  hash: {
    /**
     * @Usage HDEL key field [field ...]
     * @Purpose Delete one or more hash fields
     */
    HDEL: ["HDEL"],

    /**
     * @Usage HEXISTS key field
     * @Purpose Determine if a hash field exists
     */
    HEXISTS: ["HEXISTS"],

    /**
     * @Usage HGET key field
     * @Purpose Get the value of a hash field
     */
    HGET: ["HGET"],

    /**
     * @Usage HGETALL key
     * @Purpose Get all the fields and values in a hash
     */
    HGETALL: ["HGETALL"],

    /**
     * @Usage HINCRBY key field increment
     * @Purpose Increment the integer value of a hash field by the given number
     */
    HINCRBY: ["HINCRBY"],

    /**
     * @Usage HINCRBYFLOAT key field increment
     * @Purpose Increment the float value of a hash field by the given amount
     */
    HINCRBYFLOAT: ["HINCRBYFLOAT"],

    /**
     * @Usage HKEYS key
     * @Purpose Get all the fields in a hash
     */
    HKEYS: ["HKEYS"],

    /**
     * @Usage HLEN key
     * @Purpose Get the number of fields in a hash
     */
    HLEN: ["HLEN"],

    /**
     * @Usage HMGET key field [field ...]
     * @Purpose Get the values of all the given hash fields
     */
    HMGET: ["HMGET"],

    /**
     * @Usage HMSET key field value [field value ...]
     * @Purpose Set multiple hash fields to multiple values
     */
    HMSET: ["HMSET"],

    /**
     * @Usage HRANDFIELD key [count [WITHVALUES]]
     * @Purpose Get one or multiple random fields from a hash
     */
    HRANDFIELD: ["HRANDFIELD"],

    /**
     * @Usage HSCAN key cursor [MATCH pattern] [COUNT count]
     * @Purpose Incrementally iterate hash fields and associated values
     */
    HSCAN: ["HSCAN"],

    /**
     * @Usage HSET key field value [field value ...]
     * @Purpose Set the string value of a hash field
     */
    HSET: ["HSET"],

    /**
     * @Usage HSETNX key field value
     * @Purpose Set the value of a hash field, only if the field does not exist
     */
    HSETNX: ["HSETNX"],

    /**
     * @Usage HSTRLEN key field
     * @Purpose Get the length of the value of a hash field
     */
    HSTRLEN: ["HSTRLEN"],

    /**
     * @Usage HVALS key
     * @Purpose Get all the values in a hash
     */
    HVALS: ["HVALS"],
  },

  hyperloglog: {
    /**
     * @Usage PFADD key [element [element ...]]
     * @Purpose Adds the specified elements to the specified HyperLogLog.
     */
    PFADD: ["PFADD"],

    /**
     * @Usage PFCOUNT key [key ...]
     * @Purpose Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
     */
    PFCOUNT: ["PFCOUNT"],

    /**
     * @Usage PFDEBUG
     * @Purpose Internal commands for debugging HyperLogLog values
     */
    PFDEBUG: ["PFDEBUG"],

    /**
     * @Usage PFMERGE destkey sourcekey [sourcekey ...]
     * @Purpose Merge N different HyperLogLogs into a single one.
     */
    PFMERGE: ["PFMERGE"],

    /**
     * @Usage PFSELFTEST
     * @Purpose An internal command for testing HyperLogLog values
     */
    PFSELFTEST: ["PFSELFTEST"],
  },

  pubsub: {
    /**
     * @Usage PSUBSCRIBE pattern [pattern ...]
     * @Purpose Listen for messages published to channels matching the given patterns
     */
    PSUBSCRIBE: ["PSUBSCRIBE"],

    /**
     * @Usage PUBLISH channel message
     * @Purpose Post a message to a channel
     */
    PUBLISH: ["PUBLISH"],

    /**
     * @Usage PUBSUB CHANNELS [pattern]
     * @Purpose List active channels
     */
    PUBSUB_CHANNELS: ["PUBSUB", "CHANNELS"],

    /**
     * @Usage PUBSUB NUMPAT
     * @Purpose Get the count of unique patterns pattern subscriptions
     */
    PUBSUB_NUMPAT: ["PUBSUB", "NUMPAT"],

    /**
     * @Usage PUBSUB NUMSUB [channel [channel ...]]
     * @Purpose Get the count of subscribers for channels
     */
    PUBSUB_NUMSUB: ["PUBSUB", "NUMSUB"],

    /**
     * @Usage PUNSUBSCRIBE [pattern [pattern ...]]
     * @Purpose Stop listening for messages posted to channels matching the given patterns
     */
    PUNSUBSCRIBE: ["PUNSUBSCRIBE"],

    /**
     * @Usage SUBSCRIBE channel [channel ...]
     * @Purpose Listen for messages published to the given channels
     */
    SUBSCRIBE: ["SUBSCRIBE"],

    /**
     * @Usage UNSUBSCRIBE [channel [channel ...]]
     * @Purpose Stop listening for messages posted to the given channels
     */
    UNSUBSCRIBE: ["UNSUBSCRIBE"],
  },

  set: {
    /**
     * @Usage SADD key member [member ...]
     * @Purpose Add one or more members to a set
     */
    SADD: ["SADD"],

    /**
     * @Usage SCARD key
     * @Purpose Get the number of members in a set
     */
    SCARD: ["SCARD"],

    /**
     * @Usage SDIFF key [key ...]
     * @Purpose Subtract multiple sets
     */
    SDIFF: ["SDIFF"],

    /**
     * @Usage SDIFFSTORE destination key [key ...]
     * @Purpose Subtract multiple sets and store the resulting set in a key
     */
    SDIFFSTORE: ["SDIFFSTORE"],

    /**
     * @Usage SINTER key [key ...]
     * @Purpose Intersect multiple sets
     */
    SINTER: ["SINTER"],

    /**
     * @Usage SINTERCARD numkeys key [key ...] [LIMIT limit]
     * @Purpose Intersect multiple sets and return the cardinality of the result
     */
    SINTERCARD: ["SINTERCARD"],

    /**
     * @Usage SINTERSTORE destination key [key ...]
     * @Purpose Intersect multiple sets and store the resulting set in a key
     */
    SINTERSTORE: ["SINTERSTORE"],

    /**
     * @Usage SISMEMBER key member
     * @Purpose Determine if a given value is a member of a set
     */
    SISMEMBER: ["SISMEMBER"],

    /**
     * @Usage SMEMBERS key
     * @Purpose Get all the members in a set
     */
    SMEMBERS: ["SMEMBERS"],

    /**
     * @Usage SMISMEMBER key member [member ...]
     * @Purpose Returns the membership associated with the given elements for a set
     */
    SMISMEMBER: ["SMISMEMBER"],

    /**
     * @Usage SMOVE source destination member
     * @Purpose Move a member from one set to another
     */
    SMOVE: ["SMOVE"],

    /**
     * @Usage SPOP key [count]
     * @Purpose Remove and return one or multiple random members from a set
     */
    SPOP: ["SPOP"],

    /**
     * @Usage SRANDMEMBER key [count]
     * @Purpose Get one or multiple random members from a set
     */
    SRANDMEMBER: ["SRANDMEMBER"],

    /**
     * @Usage SREM key member [member ...]
     * @Purpose Remove one or more members from a set
     */
    SREM: ["SREM"],

    /**
     * @Usage SSCAN key cursor [MATCH pattern] [COUNT count]
     * @Purpose Incrementally iterate Set elements
     */
    SSCAN: ["SSCAN"],

    /**
     * @Usage SUNION key [key ...]
     * @Purpose Add multiple sets
     */
    SUNION: ["SUNION"],

    /**
     * @Usage SUNIONSTORE destination key [key ...]
     * @Purpose Add multiple sets and store the resulting set in a key
     */
    SUNIONSTORE: ["SUNIONSTORE"],
  },

  stream: {
    /**
     * @Usage XACK key group id [id ...]
     * @Purpose Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.
     */
    XACK: ["XACK"],

    /**
     * @Usage XADD key [NOMKSTREAM] [MAXLEN|MINID [=|~] threshold [LIMIT count]] *|id field value [field value ...]
     * @Purpose Appends a new entry to a stream
     */
    XADD: ["XADD"],

    /**
     * @Usage XAUTOCLAIM key group consumer min-idle-time start [COUNT count] [JUSTID]
     * @Purpose Changes (or acquires) ownership of messages in a consumer group, as if the messages were delivered to the specified consumer.
     */
    XAUTOCLAIM: ["XAUTOCLAIM"],

    /**
     * @Usage XCLAIM key group consumer min-idle-time id [id ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [FORCE] [JUSTID]
     * @Purpose Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.
     */
    XCLAIM: ["XCLAIM"],

    /**
     * @Usage XDEL key id [id ...]
     * @Purpose Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.
     */
    XDEL: ["XDEL"],

    /**
     * @Usage XGROUP CREATE key groupname id|$ [MKSTREAM]
     * @Purpose Create a consumer group.
     */
    XGROUP_CREATE: ["XGROUP", "CREATE"],

    /**
     * @Usage XGROUP CREATECONSUMER key groupname consumername
     * @Purpose Create a consumer in a consumer group.
     */
    XGROUP_CREATECONSUMER: ["XGROUP", "CREATECONSUMER"],

    /**
     * @Usage XGROUP DELCONSUMER key groupname consumername
     * @Purpose Delete a consumer from a consumer group.
     */
    XGROUP_DELCONSUMER: ["XGROUP", "DELCONSUMER"],

    /**
     * @Usage XGROUP DESTROY key groupname
     * @Purpose Destroy a consumer group.
     */
    XGROUP_DESTROY: ["XGROUP", "DESTROY"],

    /**
     * @Usage XGROUP SETID key groupname id|$
     * @Purpose Set a consumer group to an arbitrary last delivered ID value.
     */
    XGROUP_SETID: ["XGROUP", "SETID"],

    /**
     * @Usage XINFO CONSUMERS key groupname
     * @Purpose List the consumers in a consumer group
     */
    XINFO_CONSUMERS: ["XINFO", "CONSUMERS"],

    /**
     * @Usage XINFO GROUPS key
     * @Purpose List the consumer groups of a stream
     */
    XINFO_GROUPS: ["XINFO", "GROUPS"],

    /**
     * @Usage XINFO STREAM key [FULL [COUNT count]]
     * @Purpose Get information about a stream
     */
    XINFO_STREAM: ["XINFO", "STREAM"],

    /**
     * @Usage XLEN key
     * @Purpose Return the number of entries in a stream
     */
    XLEN: ["XLEN"],

    /**
     * @Usage XPENDING key group [[IDLE min-idle-time] start end count [consumer]]
     * @Purpose Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.
     */
    XPENDING: ["XPENDING"],

    /**
     * @Usage XRANGE key start end [COUNT count]
     * @Purpose Return a range of elements in a stream, with IDs matching the specified IDs interval
     */
    XRANGE: ["XRANGE"],

    /**
     * @Usage XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]
     * @Purpose Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.
     */
    XREAD: ["XREAD"],

    /**
     * @Usage XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] id [id ...]
     * @Purpose Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.
     */
    XREADGROUP: ["XREADGROUP"],

    /**
     * @Usage XREVRANGE key end start [COUNT count]
     * @Purpose Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE
     */
    XREVRANGE: ["XREVRANGE"],

    /**
     * @Usage XSETID key last-id
     * @Purpose An internal command for replicating stream values
     */
    XSETID: ["XSETID"],

    /**
     * @Usage XTRIM key MAXLEN|MINID [=|~] threshold [LIMIT count]
     * @Purpose Trims the stream to (approximately if '~' is passed) a certain size
     */
    XTRIM: ["XTRIM"],
  },

};

