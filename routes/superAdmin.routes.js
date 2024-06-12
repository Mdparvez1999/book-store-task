const { addUserController, addAdminController } = require("../controllers/superAdmin.controller");
const auth = require("../middlewares/auth.middleware");
const { isSuperAdmin } = require("../middlewares/roles.middleware");

const router = require("express").Router();

router.post("/add-user", auth, isSuperAdmin, addUserController);

router.post("/add-admin", auth, isSuperAdmin, addAdminController);

module.exports = router;