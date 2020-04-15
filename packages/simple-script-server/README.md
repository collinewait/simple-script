# Simple script backend

A simple node backend for a fictitious app that creates scripts in a fake language. 

## GET STARTED

### Set up

- Navigate to the directory where you want to copy this repo, clone it by running `git clone https://github.com/collinewait/simple-script.git`

### Run the app
- `cd` into the root of the project with `cd simple-script`
- `cd` into the package containing the backend with `cd packages/simple-script-server`

create a `.env` file and add the contents in `.sample.env` file. Update the values with your environment values. Don't forget to delete the comments next to the values.

And then run the following commands.

- Run `yarn install` to install dependencies
- Run `yarn start` to start the application

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
- GET /api/v1/users/${userId} - admin can get a single user with his scripts.  
- PUT /api/v1/users/${userId} - admin can update a user.
