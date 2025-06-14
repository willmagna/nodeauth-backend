import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("users root");
});

router.get("/new", (req, res) => {
  res.status(200).send("users new");
});

export const usersRouter = router;
