const router = require("express").Router();

router.use("/registration", require("./registration"));

router.use(require("../../middlewares/user"));
router.use("/users", require("./users"));
router.use("/pay_types", require("./paytypes"));

module.exports = router;
