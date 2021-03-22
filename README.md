# How to Use:
## Client
* cd client
* npm install
* npm install axios
* npm install date-fns --save

### Creating .env file
* Purpose to store the APIKeys so they dont get pushed to github repo
* Create a file in client directory called: .env
  * Inside the file you should have two variables:
    * REACT_APP_API_KEY=Your API Key goes here
    * REACT_APP_SECRET_API_KEY=Your Seceret API Key goes here

## Running the Client after the above steps:
* cd client
* npm start

### To run API by itself
* cd ./client/src/api
* Next steps are creating a duplicate .env file just placed in api directory/folder:
  * Create a file in api directory/folder called: .env
    * Inside the file you should have two variables:
      * REACT_APP_API_KEY=Your API Key goes here
      * REACT_APP_SECRET_API_KEY=Your Seceret API Key goes here
      
* In api.js comment out the export line at the bottom
* Make sure you are in the directory/folder: 
* node api.js
  * Make sure the functions you want to run in api.js are being called (they may be commented out)
