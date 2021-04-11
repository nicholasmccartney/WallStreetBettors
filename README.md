# EZ-Trade
### Installation and Running
To setup the project environment, make sure you have node installed on your system, then run the follwing commands from the root folder of your installation,  

    npm install

    # 1) startup the entire project all at once
    npm run dev

    # 2) start server and client in separate terminal windows
    node server # in one window
    npm start # in a second window

The project can be ran two separate ways as you can see above. The first will start the server and the client in a single terminal window.
This is fine if you are not going to be altering the api because you will not have access to the server terminal.
If you will be editing the api and will need to be stopping and starting it often, go with the second method.


### Creating .env file
EZ-Trade relies on environment variables that store the API keys for Alpaca and Firebase. Use a `.env` file so set these up.`
1. Create a file in root directory called: `.env`
2. Add the following variables and their values.  


    REACT_APP_API_KEY=ALPACA_API_KEY
    REACT_APP_SECRET_API_KEY=ALPACA_SECRET_KEY
    REACT_APP_FIREBASE_API_KEY=FIREBASE_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN=FIREBASE_AUTH_DOMAIN
    REACT_APP_FIREBASE_DATABASE_URL=FIREBASE_DATABASE_URL
    REACT_APP_FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID
    REACT_APP_FIREBASE_STORAGE_BUCKET=FIREBASE_STORAGE_BUCKET
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=FIREBASE_MESSAGING_SENDER_ID
    REACT_APP_FIREBASE_APP_ID=FIREBASE_APP_ID
    REACT_APP_FIREBASE_MEASUREMENT_ID=FIREBASE_MEASUREMENT_ID


Alpaca Credentials can be found through your personal Alpaca API account. Firebase Credentials can be aquired from the groups Firebase Project Console.
