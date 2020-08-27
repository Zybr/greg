#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Read params
mock=0
i=1;
for param in "$@"
do
  if [[ "$param" == '-m' ]]; then
    mock=1
  fi
  i=$((i+1))
done;

# Handle command
case "$1" in
    start )
      clear
      echo -e "\n\e[32mBack\e[0m"
      echo -e "\n\e[32mStop servers\e[0m"
      npm stop --prefix "$DIR"/back/

      if [[ "$mock" == 1 ]]; then
        echo -e "\n\e[32mRun mock server\e[0m"
        cmdStartBack="npm run start:mock --prefix $DIR/back/"
      else
        cmdStartBack="npm start --prefix $DIR/back/"
        echo -e "\n\e[32mRun server\e[0m"
      fi

      eval "$cmdStartBack" \
      & (sleep 1 \
        && echo  -e "\n\e[32mFront\e[0m" \
        && echo  -e "\n\e[32mStar server & build web\e[0m" \
        && (
          npm start --prefix "$DIR"/front/ \
          & npm run build --prefix "$DIR"/front/
        )
      )
      ;;

    routes )
      echo -e "\n\e[32mRoutes\e[0m"
      echo -e "\n\e[32mBack\e[0m"
      npm run routes --prefix "$DIR"/back
      echo -e "\n\e[32mFront\e[0m"
      npm run routes --prefix "$DIR"/front
      ;;

    tests )
      echo -e "\n\e[32mTests Back\e[0m"
      npm run tests --prefix "$DIR"/back
      ;;

    codestyles )
      echo -e "\n\e[32mBack\e[0m"
      npm run code-styles:fix --prefix "$DIR"/back
      echo -e "\n\e[32mFront\e[0m"
      npm run code-styles:fix --prefix "$DIR"/front
      ;;

    fixtures )
      npm run fixtures:load:renew --prefix "$DIR"/back
      ;;

    * )
      echo -e "\e[32mstart\e[0m - Start application"
      echo -e "\e[32mstart -m\e[0m - Start application with mocked back"
      echo -e "\e[32mtests\e[0m - Run tests"
      echo -e "\e[32mcodestyles\e[0m - Fix codestyle"
      echo -e "\e[32mroutes\e[0m - Show available routes"
      echo -e "\e[32mfixtures\e[0m - Fill DB"
esac
