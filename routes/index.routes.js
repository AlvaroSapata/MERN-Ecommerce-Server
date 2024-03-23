const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("LA.GRIMA Taller Index");
});

module.exports = router;
