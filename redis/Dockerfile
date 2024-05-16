FROM redis:7.2.4-alpine3.19
EXPOSE 6379
EXPOSE 6380
RUN apk add --no-cache netcat-openbsd
WORKDIR /usr/src/app
COPY ./configs/http_server.sh /usr/src/app/http_server.sh
RUN chmod +x /usr/src/app/http_server.sh
COPY ./configs/run.sh /usr/src/app/run.sh
RUN chmod +x /usr/src/app/run.sh
COPY ./configs/redis.conf /usr/local/etc/redis/redis.conf
CMD [ "sh", "/usr/src/app/run.sh"]

