#!/bin/bash
cd ./app 
yarn
yarn run export
cd ..
mkdir -p ./nginx/static/
rm -rf ./nginx/static/
cp -r ./app/out/ ./nginx/static
docker-compose up --build -d