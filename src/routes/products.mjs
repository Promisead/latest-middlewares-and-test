import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  if (request.cookies.hello && request.cookies.hello === "people")
    return response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);

  return response.status(403).send({
    msg: "You don't have access",
  });
});

export default router;
