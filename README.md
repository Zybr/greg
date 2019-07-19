## Upload project
    mkdir greg
    cd greg
    git init
    git remote add origin git@github.com:Zybr/greg.git
    git branch --set-upstream-to=origin/master
    git pull

## Back (folder "back")
### Install packages
    npm install -g typescript # Global Typescript
    npm install -g ts-node # Global Typescript interpreter
    npm install -g ts-node-dev # Global Typescript interpreter (live watch)
    npm install # Local packages
### Start
    npm start # Start server
### Test
    npm test

## Front (folder "front")
### Install packages
    npm install # Local packages
### Start
    npm start # Start server
    npm run build # Decode (TS, styles, etc.) and build dependences (live watch) 
    
## Commands
    For additional commands read packcage.json, section "scritps".
