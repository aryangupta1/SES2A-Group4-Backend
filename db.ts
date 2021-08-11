import {Pool} from 'pg';

//More pools will be initiliased when more db's are made
const pool = new Pool({
    user: "postgres",
    /*Remember to remove your password and leave the value here as 'password'. 
    Do not commit your actual password! Only use it for testing purposes*/
    password: "password", 
    host: "localhost",
    port: 5432,
    database: "students"
});

export default pool;