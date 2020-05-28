#!/bin/bash
git pull &&
    npm version patch &&
    git push --tags

name=$(awk '$1=="\"name\":" {print $2}' ./package.json)
name=${name#*\"}
name=${name%\"*}
version=$(awk '$1=="\"version\":" {print $2}' ./package.json)
version=${version#*\"}
version=${version%\"*}

echo name: "$name" &&
    echo version: "$version" &&
    npm run build &&
    docker image build -f ./docker/Dockerfile -t "$name":"$version" . &&
    docker save -o ./"$name"_"$version".tar "$name":"$version" &&
    docker rmi "$name":"$version" &&
    if [ "$1" != "" -a "$2" != "" ]; then
        echo scp to: "$1" &&
            scp ./"$name"_"$version".tar "$1":"$2" &&
            rm -f ./"$name"_"$version".tar &&
            ssh -t "$1" "sudo docker image load -i \"$2\"/\"$name\"_\"$version\".tar && sudo docker kill $(sudo docker ps | grep ":80" | awk '{print $1}') && sudo docker run -d -p 80:7777 \"$name\":\"$version\"" &&
            url = print "$1" | awk -F\@ '{print "http://"$2}' &&
            open "$url"
    fi
