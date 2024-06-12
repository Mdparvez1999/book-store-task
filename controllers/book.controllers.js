const mongoose = require("mongoose");
const Book = require("../models/book.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendMail.utils");

const addBookController = asyncHandler(async (req, res, next) => {
    const { title, author, description, publishedDate, price } = req.body;

    if (!title || !author || !description || !publishedDate || !price) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    }

    const userId = req.user._id;

    const book = await Book.create({
        title,
        author,
        description,
        publishedDate,
        price,
        createdBy: userId
    });

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: process.env.SUPER_ADMIN_EMAIL,
        subject: "New Book Added",
        html: `<h1>Book Added</h1>
        <p>Book Title: ${title}</p> 
        <p>Book Author: ${author}</p>
        <p>Book Description: ${description}</p>
        <p>Book Published Date: ${publishedDate}</p>
        <p>Book Price: ${price}</p>`
    }

    sendEmail(mailOptions);

    res.status(201).json({
        message: "book added successfully",
        book
    })
});

const getAllBooksController = asyncHandler(async (req, res, next) => {
    const books = await Book.find({});

    if (!books || books.length === 0) {
        const err = new AppError("no books found", 404);
        return next(err);
    }

    res.status(200).json({
        message: "successful",
        books
    })
});

const getApprovedBooksController = asyncHandler(async (req, res, next) => {
    const books = await Book.find({ approved: true });

    if (!books || books.length === 0) {
        const err = new AppError("no books found", 404);
        return next(err);
    }

    res.status(200).json({
        message: "successful",
        books
    })
});

const getSingleBookController = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        const err = new AppError("invalid book id", 400);
        return next(err);
    };

    const book = await Book.findById(bookId);

    if (!book) {
        const err = new AppError("book not found", 404);
        return next(err);
    }

    res.status(200).json({
        message: "successful",
        book
    })

})

const updateBookController = asyncHandler(async (req, res, next) => {
    const { title, author, description, publishedDate, price } = req.body;

    if (!title || !author || !description || !publishedDate || !price) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    }

    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        const err = new AppError("invalid book id", 400);
        return next(err);
    };

    const book = await Book.findById(bookId);

    if (!book) {
        const err = new AppError("book not found", 404);
        return next(err);
    }

    const userId = req.user._id;

    const updatedBook = await Book.findByIdAndUpdate(bookId, {
        title,
        author,
        description,
        publishedDate,
        price,
        createdBy: userId
    }, { new: true });

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: process.env.SUPER_ADMIN_EMAIL,
        subject: "Book Updated",
        html: `<h1>Book Updated</h1>
        <p>Book Title: ${title}</p> 
        <p>Book Author: ${author}</p>
        <p>Book Description: ${description}</p>
        <p>Book Published Date: ${publishedDate}</p>
        <p>Book Price: ${price}</p>`
    }

    sendEmail(mailOptions);

    res.status(200).json({
        message: "successful",
        updatedBook
    })
})

const deleteBookController = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        const err = new AppError("invalid book id", 400);
        return next(err);
    };

    await Book.findByIdAndDelete(bookId);

    res.status(200).json({
        message: "successful",
    })

});

const approveBookController = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;

    const book = await Book.findById(bookId).populate('createdBy');

    if (!book) {
        const err = new AppError("book not found", 404);
        return next(err);
    };

    await Book.findByIdAndUpdate(bookId, {
        approved: true
    }, { new: true });

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: book.createdBy.email,
        subject: "Book Approved",
        html: `<h1>Book Approved</h1>
        <p>Book Title: ${book.title}</p> 
        <p>Book Author: ${book.author}</p>
        <p>Book Description: ${book.description}</p>
        <p>Book Published Date: ${book.publishedDate}</p>
        <p>Book Price: ${book.price}</p>`
    };

    sendEmail(mailOptions);

    res.status(200).json({
        message: "successful"
    })
});

const rejectBookController = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;

    const book = await Book.findById(bookId).populate('createdBy');

    if (!book) {
        const err = new AppError("book not found", 404);
        return next(err);
    };

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: book.createdBy.email,
        subject: "Book Rejected",
        html: `<h1>Book Rejected</h1>
        <p>Book Title: ${book.title}</p> 
        <p>Book Author: ${book.author}</p>
        <p>Book Description: ${book.description}</p>
        <p>Book Published Date: ${book.publishedDate}</p>
        <p>Book Price: ${book.price}</p>`
    };

    res.status(200).json({
        message: "successful"
    });
}
)
module.exports = {
    addBookController,
    getAllBooksController,
    getApprovedBooksController,
    getSingleBookController,
    updateBookController,
    deleteBookController,
    approveBookController,
    rejectBookController
}