#!/bin/bash
cp -rf ./server/index.js ./docker/server/index.js
cp -rf ./server/package.json ./docker/server/package.json
cd ui && npm run build
cd ..
cp -rf ./ui/dist/* ./docker/www/
cd docker && docker build . -t tasuku
docker tag tasuku registry.code-garage-solutions.de/tasusku
docker push registry.code-garage-solutions.de/tasusku
