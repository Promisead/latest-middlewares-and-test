import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";
import dotenv from "dotenv";

dotenv.config();

describe("/api/auth", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should return 401 when not logged in", async () => {
    const response = await request(app).get("/api/auth/status");
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});

// const app = express();

// app.get("/hello", (req, res) => res.status(200).send({ msg: "welcome" }));

// describe("hello endpoint", () => {
//   it("get /hello emdpoint", async () => {
//     const response = await request(app).get("/hello");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toStrictEqual({ msg: "welcome" });
//   });
// });
