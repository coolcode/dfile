#!/bin/bash
cd ./app 
yarn
yarn run export
cp out ../nginx/static
cd ..
docker-compose up -d