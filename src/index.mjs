import express, { request, response } from "express";
const app = express();

import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

mongoose
  .connect(
    "mongodb+srv://promise:2992029920@cluster0.cm0hr.mongodb.net/express_latest"
  )
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

// Set the server to listen on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

//client_id: 1251926699789254667
//secret_id: FRhbB0sFgySXeuUEb4JlhPo7MF844RDk
//http://localhost:5000/api/auth/discord/redirect
