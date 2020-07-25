## Upload project
```shell script
mkdir greg
cd greg
git init
git remote add origin git@github.com:Zybr/greg.git
git branch --set-upstream-to=origin/master
git pull
```

## Back (folder "back")
### Install packages
```shell script
npm install -g typescript # Global Typescript
npm install -g ts-node # Global Typescript interpreter
npm install -g ts-node-dev # Global Typescript interpreter (live watch)
npm install # Local packages
```
### Start
```shell script
npm start # Start server
```
### Test
```shell script
npm test # Run tests [fileName]
npm run test-debug [fileName] # Run test and show deatails
# fileName - Name of specific file without prefix "Test.ts"
```
## Front (folder "front")
### Install packages
```shell script
npm install # Local packages
```
### Start
```shell script
npm start # Start server
npm run build # Decode (TS, styles, etc.) and build dependences (live watch) 
```
## Commands
Show avaiable commands
```shell script
/back/$ npm run -l 
/front/$ npm run -l 
/$ ./cmd 
```
