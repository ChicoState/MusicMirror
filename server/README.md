To run on terminal use node server.js you should get a message
If Docker wont build and you're getting an error saying axios isn't working in src/compenents/Youtube or similar
go to docker destop, delete the images(containers) and volume
once done, insure that you have installed axios in server/, musicmirror and in mussicmirror/src/components
::RUN:: npm install axios --save
Once all those steps are done go to the level of MusicMirror/musicmirror and run the command

--> docker-compose up --build

If you get another error saying it couldn't build do to space or similar run this command

--> docker system prune

it will delete all the images not running and hanging as well containers, using it with -a will delete all of them
