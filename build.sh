#!/bin/bash
cd ./app 
yarn
yarn run export
cp -r out ../nginx/static
cd ..
docker-compose up --build -d