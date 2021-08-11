# SES2A-Group4-Backend
## Using Express Js

## Quick Start
```bash
# Install dependencies any dependencies
yarn
# Run server 
yarn start
```

## Database setup 
#### Make sure you have Postgres installed
[Installation video](https://www.youtube.com/watch?v=fZQI7nBu32M&ab_channel=Socratica). 
If you have already installed it ignore this step
#### Create the students database
Open up a terminal/command prompt
```bash
psql -U postgres
```
Enter the password that you set during Postgres installation, here we will be using the default Postgres user, which is a super admin (has access to everything).
Create the students database:
```bash
CREATE DATABASE students;
```
You can view it with:
```bash
\c students
```
Next we will create the students table:
```bash
CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    preferredRole VARCHAR(255),
    skills VARCHAR(500),
    currentGroupStatus boolean 
);
```

You can view this table by entering the following command:
```bash
\dt
```

Now we need to setup the db with our server. Navigate to [db.ts](db.ts). Set the `password` field as your local password that you used to log in to the Postgres user earlier. 
**Dont forget to revert the password back to 'password' when you are done testing with the db. Do not commit your actual password!**


For more reference on the different sql commands refer to 
[database.sql](database.sql). In future this file will include more commands and this readme will be updated accordingly.


