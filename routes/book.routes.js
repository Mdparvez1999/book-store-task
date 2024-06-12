const { addBookController, getAllBooksController, getSingleBookController, updateBookController, deleteBookController, getApprovedBooksController, approveBookController, rejectBookController } = require("../controllers/book.controllers");
const auth = require("../middlewares/auth.middleware");
const { isAdmin, isAdminOrSuperAdmin, isSuperAdmin } = require("../middlewares/roles.middleware");

const router = require("express").Router();

router.post("/add-book", auth, isAdmin, addBookController);

router.get("/get-all-books", auth, isSuperAdmin, getAllBooksController);

router.get("/get-approved-books", auth, getApprovedBooksController);

router.get("/get-single-book/:id", auth, getSingleBookController);

router.put("/update-book/:id", auth, isAdmin, updateBookController);

router.delete("/delete-book/:id", auth, isAdminOrSuperAdmin, deleteBookController);

router.put("/approve-book/:id", auth, isSuperAdmin, approveBookController);

router.put("/reject-book/:id", auth, isSuperAdmin, rejectBookController);

module.exports = router;