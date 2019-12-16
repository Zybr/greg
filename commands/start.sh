#!/usr/bin/env bash
clear
echo "STOP"
npm stop --prefix ./back/
echo "START"
npm start --prefix ./back/ \
& npm start --prefix ./front/ \
& npm run build --prefix ./front/
