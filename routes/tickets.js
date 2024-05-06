const router = require("express").Router();
const express = require("express");

router.use(require("../middlewares/tickets"));
router.use(
  "/assets/tickets",
  express.static(`${__dirname}/../assets/tickets`)
);
module.exports = router;
