#!/bin/bash
node -v &&
    npm -v &&
    npm install -g tnpm --registry=https://registry.npm.alibaba-inc.com &&
    tnpm install &&
    if [ "$1" = "common" ]; then
        npm run build
    else
        npm run build:"$1"
    fi
