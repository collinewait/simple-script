# Simple script

A simple node backend for a fictitious app that creates scripts in a fake language. It is using an in-memory data store. Basically playing with objects.

## GET STARTED

### Set up

- Navigate to the directory where you want to copy this repo, clone it by running `git clone <link of the repo>`

### Run the app

- Run `npm install` to install dependencies
- Run `npm start` to start the application

### API Endpoints

- POST /api/auth/signup  - user can sign up
- POST api/auth/login - user can login
- POST /api/v1/scripts - user can  create scripts
- GET /api/v1/scripts - user can get all scripts
- GET /api/v1/scripts/${scriptId} - user can get a single script
- PUT /api/v1/scripts/${scriptId} - user can update a script
- DELETE /api/v1/scripts/${scriptId} - user can delete a script
- PATCH /api/v1/scripts/${scriptId} - user can execute a script and update its output value
- POST /api/v1/users - admin can add a user
- GET /api/v1/users - admin can get a list of users
- GET /api/v1/users/${userEmail} - admin can get a single user with his scripts. `userEmail` used here for brevity. `userId` would have been better.  
- PUT /api/v1/users/${userEmail} - admin can update a user.


You can login as an admin with a sample user hard coded. These are the details: `email: "wait@wait.com"` and `password: "pass"`
