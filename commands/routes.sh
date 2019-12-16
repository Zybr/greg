#!/usr/bin/env bash
echo "BACK"
npm run routes --prefix ./back/
printf "\nFRONT"
npm run routes --prefix ./front/
