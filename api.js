const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3003;

// Sample data for demonstration
let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" }
];


app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hii");
  });

app.get("/users", (req, res) => {
  res.json(users);
});


app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});


app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updateUser = req.body;
  let index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updateUser };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*To check output use powershell command

POST
Invoke-RestMethod -Uri http://localhost:3003/users -Method Post -Body (@{id=4; name="Ann"} | ConvertTo-Json) -ContentType "application/json"

PUT
Invoke-RestMethod -Uri http://localhost:3003/users/1 -Method Put -Body (@{name="Ram"} | ConvertTo-Json) -ContentType "application/json" 

DELETE
Invoke-RestMethod -Uri http://localhost:3003/users/1 -Method Delete 
*/
