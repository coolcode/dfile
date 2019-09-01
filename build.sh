#!/bin/bash
cd ./app 
yarn
yarn run export
cd ..
mkdir -p ./nginx/static/
rm -rf ./nginx/static/
cp -r ./app/out/ ./nginx/static
cp -r ~/dfile/app/out/* /var/www/html/
docker-compose up --build -d