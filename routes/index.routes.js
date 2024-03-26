const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("LA.GRIMA Taller Server Index");
});

module.exports = router;
