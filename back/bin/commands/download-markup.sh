#!/usr/bin/env bash
# Download markups for test parsers.
path=$1
eval "cp $path/google.html $path/_google.html"; # Store previous
eval "wget -O $path/google.html -U \"Chrome\" www.google.com/search?q=data"; # Download new
