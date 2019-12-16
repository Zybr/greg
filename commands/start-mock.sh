#!/usr/bin/env bash
clear
echo "STOP"
npm stop --prefix ./back/
echo "START"
npm run start-mock --prefix ./back/ \
& npm start --prefix ./front/ \
& npm run build --prefix ./front/
