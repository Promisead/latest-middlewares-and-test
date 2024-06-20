import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import session from "express-session";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        throw err;
      }
    });
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

// Route for the home page
router.get("/", (req, res) => {
  res.cookie("hello", "people", { maxAge: 30000, signed: true });
  res.status(200).send(`
    <h1>Hello Express </h>
  `);
});

router.get(
  "/api/users/:id",
  resolveIndexByUserId,
  getUserByIdHandler
  /* (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
} */
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  createUserHandler
  // async (request, response) => {
  //   //New Logic to create new user to mongoDB database

  //   //  const { body } = request;
  //   const result = validationResult(request);
  //   if (!result.isEmpty()) return response.status(400).send(result.array());
  //   const data = matchedData(request);
  //   console.log(`before hash : ${data.password}`);
  //   data.password = hashPassword(data.password);
  //   console.log(`After hash : ${data.password}`);

  //   const newUser = new User(data);
  //   try {
  //     const savedUser = await newUser.save();
  //     return response.status(201).send(savedUser);
  //   } catch (err) {
  //     return response.sendStatus(400);
  //   }

  //   // Logic to create a new user
  //   /* const result = validationResult(req);
  //   if (!result.isEmpty())
  //     return res.status(400).send({
  //       errors: result.array(),
  //     });
  //   const data = matchedData(req);
  //   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  //   mockUsers.push(newUser);
  //   res.status(201).send(`User  Added Successfully`); */
  // }
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
