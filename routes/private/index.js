const router = require("express").Router();

router.use("/registration", require("./registration"));

router.use(require("../../middlewares/user"));
router.use("/users", require("./users"));
router.use("/pay_types", require("./paytypes"));
router.use("/halls", require("./halls"));
router.use("/events", require("./events"));
router.use("/places_tariffs", require("./placesTariffs"));
router.use("/tariffs", require("./tariffs"));
router.use("/discounts", require("./discount"));
router.use("/orders", require("./orders"));
router.use("/agents", require("./agents"));
router.use("/config", require("./config"));

module.exports = router;
