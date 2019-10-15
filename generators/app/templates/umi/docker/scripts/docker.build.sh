#!/bin/bash
if [ x"$1" = x ]; then
    echo "name is required!"
    exit 1
fi
if [ x"$2" = x ]; then
    echo "version is required!"
    exit 1
fi

echo version: "$1"
docker image build -f ./docker/Dockerfile -t "$1":"$2" . &&
    docker save -o ./"$1"_"$2".tar "$1":"$2"
