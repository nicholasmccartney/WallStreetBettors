# How to Properly install and run
## Pull repo

### React CLient setup
* cd into client directory
* run the command: npm install

### Alpaca API setup
Go to the 'server' folder and create a new file called: '.env' without the single quotes

This file will be used to locally store the API keys so they won't be public on GitHub commits. Inside of the .env folder you created you will write:

* API_KEY= whatever the API key is for the alpaca API you are using
* SECRET_API_KEY= whatever the secret API key for the alpaca API you are using

### Command to display paper trading account info
* node index.js

