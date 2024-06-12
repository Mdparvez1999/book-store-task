const router = require("express").Router();

const { createOrderController, purchaseBookController } = require("../controllers/user.controllers");
const auth = require("../middlewares/auth.middleware");

router.post("/create-order/:id", auth, createOrderController);

router.post("/purchase-book/:id", auth, purchaseBookController);

module.exports = router;