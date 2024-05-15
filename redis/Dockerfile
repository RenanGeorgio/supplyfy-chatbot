FROM redis:7.2.4-alpine3.19
EXPOSE 8080
COPY ./configs/redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
