const mongoose = require("mongoose");
const Book = require("../models/book.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendMail.utils");

const createOrderController = asyncHandler(async (req, res, next) => {
    const quantity = req.body.quantity;

    if (!quantity) {
        const err = new AppError("quantity is required", 400);
        return next(err);
    }

    const userId = req.user._id;

    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        const err = new AppError("invalid book id", 400);
        return next(err);
    }

    const book = await Book.findById(bookId);

    if (!book) {
        const err = new AppError("book not found", 404);
        return next(err);
    }

    const totalPrice = book.price * quantity;

    const order = await Order.create({
        userId,
        bookId,
        quantity,
        totalPrice
    });

    res.status(201).json({
        message: "order created successfully",
        order
    });
})

const purchaseBookController = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const orderId = req.params.id;
    const order = await Order.findOne({ userId, _id: orderId }).populate("bookId");

    if (!order) {
        const err = new AppError("order not found", 404);
        return next(err);
    };

    const user = await User.findById(userId);

    user.purchasedBooks.push(order.bookId);
    await user.save();

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: user.email,
        subject: "Bookstore Management - Purchase Confirmation",
        html: `
            <h1>Hello ${user.userName}</h1>
            <p>You have successfully purchased a book.</p> `
    };

    sendEmail(mailOptions);

    const mailOptions2 = {
        from: process.env.HOST_EMAIL,
        to: process.env.SUPER_ADMIN_EMAIL,
        subject: "new purchase",
        html: `
            <h1>New Purchase</h1>
            <p>Book Title: ${order.bookId.title}</p>
            <p>Book Author: ${order.bookId.author}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Total Price: ${order.totalPrice}</p> `
    };

    sendEmail(mailOptions2);

    return res.status(200).json({
        message: "books purchased successfully",
    })

})

module.exports = {
    createOrderController,
    purchaseBookController
};