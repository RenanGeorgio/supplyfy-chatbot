#!/bin/bash
nohup sh /usr/src/app/http_server.sh & redis-server /usr/local/etc/redis/redis.conf
