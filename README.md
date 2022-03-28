The time tracker applicaiton built for Allianz is created by prime-react free template
which leverages from Reactjs library and create-app command within it.

To run the application, first it is required to have the docker image provided by Ali Sarel(from Allianz)
from this URL: https://hub.docker.com/r/alirizasaral/timetracker/ 
The website also has its own set of instructions to run and test, however for our applicaiton,
it is only required to run the container with this command: 
docker run -d -p 8080:8080 alirizasaral/timetracker:1

Also be noted that port used to run the application needs to be 8080.
Otherwise, it will not be possible for react app to talk to backend.
If there is chance in port or in URL package.json file has an entry as "proxy": "http://localhost:8080",
and this needs to be updated accordingly.

As for the react front end application, it is available on URL: https://hub.docker.com/r/necatibatur/allianz-timetracker
After downloading the docker image from this public URL it needs to be run via 
docker run -i -t --name allianz-timetracker  -d -p 3000:3000 allianz-timetracker:latest
Here again the command list and port selection is important as it is built on this configuration.

It is a single page Reactjs applicaiton that has 3 functionality;
1. Display existing time track records either by typing or without typing a certain email to identify employee
2. Create a new time track record with email, start and end information.
3. Export CSV from the queried timetrack records.

Simple steps to have a runnning application;
1. Project is built via using reactjs, therefore to have locally built there needs to be nodejs 14 or over version is   installed + vscode to run and build the app easily.
If no vscode is not available it is also possible to simply run npm install and npm start commands.


2. To get the copy of the source code the project is on github https://github.com/nbatur/allianz-timetracker just run;
git clone git@github.com:nbatur/allianz-timetracker.git

    a. Basically, go under the project directory then run "npm install" to build the project afterwards, run the "npm start" to start the application running.

    b. To build the docker image the following commands need to be run under project dir

    docker build -t allianz-timetracker:latest .
    docker run -i -t --name allianz-timetracker  -d -p 3000:3000 allianz-timetracker:latest
 

3. It is possible to directly use the online copy of docker image from: https://hub.docker.com/r/necatibatur/allianz-timetracker
After getting online copy it is run with same command: docker run -i -t --name allianz-timetracker  -d -p 3000:3000 allianz-timetracker:latest