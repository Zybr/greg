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
        cmdStartBack="npm run start-mock --prefix $DIR/back/"
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
    test )
      echo -e "\n\e[32mTests Back\e[0m"
      npm run test --prefix "$DIR"/back
      ;;
    codestyle )
      echo -e "\n\e[32mBack\e[0m"
      npm run code-style-fix --prefix "$DIR"/back
      echo -e "\n\e[32mFront\e[0m"
      npm run code-style-fix --prefix "$DIR"/front
      ;;

    * )
      echo -e "\e[32mstart\e[0m - Start application"
      echo -e "\e[32mstart -m\e[0m - Start application with mocked back"
      echo -e "\e[32mtest\e[0m - Run tests"
      echo -e "\e[32mroutes\e[0m - Show available routes"
esac
