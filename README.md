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

## Install Mongo DB (Ubuntu 18.04)
[Documentation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
```shell script
sudo wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add - Import the public key used by the package management system.
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list Create a list file for MongoDB
sudo apt-get update # Reload local package database
sudo apt-get install -y mongodb-org # Install the MongoDB packages
sudo systemctl start mongod # Start MongoDB
sudo systemctl status mongod # Verify that MongoDB has started successfully
sudo systemctl enable mongod.service # Add the service to autostart
mongo # Begin using MongoDB
```

### Start
```shell script
npm start # Start server
```
### Test
```shell script
npm test # Run tests [fileName]
npm run tests:debug [fileName] # Run test and show deatails
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
