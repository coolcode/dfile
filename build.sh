#!/bin/bash
cd ./app && yarn run export
cd ..
docker-compose up -d