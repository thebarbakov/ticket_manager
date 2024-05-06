const router = require("express").Router();

router.get("/config", require("../../controllers/public/config"));
router.use("/events", require("./events"));
router.use("/registration", require("./registration"));
router.use(require("../../middlewares/agent"));
router.use("/agent", require("./agent"));
router.use("/order", require("./orders"));

module.exports = router;
