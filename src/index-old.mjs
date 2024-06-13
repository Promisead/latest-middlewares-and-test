import express from "express";
const app = express();

// Middleware for logging request details
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  console.log("Request Type:", req.method);
  console.log("Request URL:", req.originalUrl);
  next(); // Pass control to the next middleware function
});

// Middleware for parsing JSON bodies
app.use(express.json());

const mockUsers = [
  { id: 1, username: "stone", age: 40 },
  { id: 2, username: "joe", age: 63 },
  { id: 3, username: "promise", age: 10 },
  { id: 4, username: "alice", age: 20 },
  { id: 5, username: "banabas", age: 30 },
  { id: 6, username: "chucks", age: 50 },
  { id: 7, username: "desmond", age: 60 },
  { id: 8, username: "felx", age: 70 },
];

// Route for the home page
app.get("/", (req, res) => {
  res.status(201).send(`
    <h1>Hello Express </h>
  `);
});

// Route for retrieving all users
app.get("/api/users", (req, res) => {
  // Logic to retrieve all users
  const {
    query: { filter, value },
  } = req;
  //console.log(query.filter);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  res.status(201).send(mockUsers);
});

// Route for retrieving a specific user by id
app.get("/api/users/:id", (req, res) => {
  //const user = req.params;
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId))
    return res
      .status(400)
      .send({ msg: `Bad Request, ${req.params.id} is invalid.` });
  // Logic to retrieve a user by id
  //res.send(`Details for user with id ${req.params.id}`);
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

// Route for updating a specific user by id using PUT
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.sendStatus(200);
});

// Route for partially updating a specific user by id Using Patch
app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(201).send({
    message: "User Updated Successfully",
    updatedUser: mockUsers[findUserIndex],
  });
});

// Route for deleting a specific user by id
app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  const username = mockUsers[findUserIndex].username;
  console.log(username);
  res.status(200).send(`${username}  Deleted Successfully!`);
});

// Route for creating a new user
app.post("/api/users", (req, res) => {
  // Logic to create a new user
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  console.log(newUser);
  res.status(201).send(`${newUser} Added Successfully`);
});

// Set the server to listen on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
