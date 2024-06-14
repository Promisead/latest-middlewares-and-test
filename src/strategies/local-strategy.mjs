import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
//import { User } from "../mongoose/schemas/user.mjs";
//import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Inside Deserialize User`);
  console.log(`Deserialize User ID: ${id}`);

  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
