#!/usr/bin/env bash

function copy() {
    dir=$(dirname $1)
    mkdir -p draw/$dir
    cp --verbose --recursive --update\
       --target-directory draw/$dir\
       repo/yliss/$1
}

copy images/imgen
copy imgen.org
