const router = require("express").Router();
const express = require("express");

const NotFound = require("../errors/NotFound");

router.use("/public", require("./public/index.js"));
router.use("/private", require("./private/index.js"));

router.all("*", (req, res, next) => {
  next(new NotFound("Неправильный путь"));
});

module.exports = router;
