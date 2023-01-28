require("dotenv").config();

// importing dependencies
const express = require("express");
const cors = require("cors");

// importing custom middlewares
const connectDB = require("./utils/database");
// const timestamp = require('./src/utils/timestamp'); // use this for timestamp purpose - timestamp()

// global variables
const app = express();
const port = process.env.PORT;

// cors settings
var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// initialzing database
// connectDB();

// test Router
app.get("/", (req, res) => {
  //   let document = `https://documenter.getpostman.com/view/18344806/UVkgxe87`;
  res.send({
    mesage: `Go to this URL to view the API Documentation.`,
  });
});

// main routes

app.use("/api/auth", require("./routers/auth"));

// exposing the application
app.listen(port, () => {
  connectDB();
  console.log(`server is up and running on ${port}`);
});
