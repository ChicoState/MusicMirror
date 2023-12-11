# MusicMirror

## How to run the app with Docker:
1. Make sure you are in the project's root directory (MusicMirror), which should contain the subdirectories "backend" and "musicmirror".
2. Next, run docker-compose up --build
   - You can also break this up into two steps by running "docker-compose build ." and "docker-compose up" in order.
3. This should start both the react app and the backed api server in docker containers.
4. You can check that they are both up by opening localhost:3002 and 3000 in your browser respectively.
   - If you wish to test the api endpoints, you can use Postman or other ways of sending api requests and send them to localhost:5000 + "endpoint path"

## How to get started with React (windows, linux/mac steps may vary):

1. Follow the answer in this [SO thread](https://stackoverflow.com/questions/41524903/why-is-npm-install-really-slow) (There's a command in there that says 'nvm install 7' replace 7 with '--lts')
3. Clone repo into your IDE
3. Checkout branch devsetup
4. Run **git pull**
5. Install React with **npm install -g create-react-app**
6. Run **npm install**
7. Go into musicmirror folder (cd musicmirror) and run **npm start**

You should be able to see something like this in your terminal 
> musicmirror@0.1.0 start
> react-scripts start

Give it a few minutes and you should have a new window opened in your browser and other text indicating React is starting with ***Compiled successfully*** text.

Nodejs version (node -v): 18.17.1
npm version (npm -v) 10.1.0
