#!/bin/bash

while true;
  do echo -e "HTTP/1.1 200 OK\n\nOK" | nc -lN 6380; 
done