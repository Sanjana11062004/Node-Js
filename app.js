/*Express js application - task 3 and task 4 */

const express = require("express");
//const bodyParser = require("body-parser"); //This is a middleware that parses incoming request bodies

const app = express();
const PORT = 3006;
//This is a coustom middleware
const coustomMiddleware = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware function
};
//To use custom middleware
app.use(coustomMiddleware);
//app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("This is get request");
});

app.post("/", (req, res) => {
  const data = req.body;
  res.json({ message: "Received POST request", data });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
