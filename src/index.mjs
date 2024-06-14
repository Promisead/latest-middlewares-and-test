import express, { request, response } from "express";
const app = express();

import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import "./strategies/local-strategy.mjs";

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cookieParser("hellopeople"));

app.use(
  session({
    secret: "champion the dev",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

// Set the server to listen on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
