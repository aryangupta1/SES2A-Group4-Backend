const express = require("express");
const app = express();
const cors = require("cors");

//middleware
app.use(cors());
//Helps us to get data from client side, ie from the request.body object
app.use(express.json())

//Refer to README file for instructions on how to run server
app.listen(5000, () => {
    console.log("Server has started on port 5000");
});