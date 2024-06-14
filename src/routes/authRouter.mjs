//import express from "express";
//const app = express();
import { Router } from "express";
import passport from "passport";

import "../strategies/local-strategy.mjs";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

//Testing Authentication
router.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    response.sendStatus(200);
  }
);

//Checking Login Status
router.get("/api/auth/status", (request, response) => {
  console.log(`Inside auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

//Logout a User
router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(400);
  response.status(200).send("You Logged Out Successfully!");
});

export default router;
