const router = require("express").Router();
const express = require("express");

const NotFound = require("../errors/NotFound");

router.use(
  "/assets/halls_schemes",
  express.static(`${__dirname}/../assets/halls_schemes`)
);
router.use(
  "/assets/events_posters",
  express.static(`${__dirname}/../assets/events_posters`)
);
router.use("/public", require("./public/index.js"));
router.use(require("./tickets.js"));
router.use("/private", require("./private/index.js"));

router.all("*", (req, res, next) => {
  next(new NotFound("Неправильный путь"));
});

module.exports = router;
