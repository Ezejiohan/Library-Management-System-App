const { fetchBook, createBook, fetchBookById, deleteBook, findBook } = require('../repository/book');

exports.createBook = async (req, res) => {
    try {
        const { title, author, isbn, status } = req.body;

        const existingBook = await fetchBook({ isbn });
        if (existingBook) {
            return res.status(400).json({ error: "A book with this ISBN already exists" });
        }

        const book = await createBook({
            title,
            author,
            isbn,
            status
        });

        await book.save();

        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBooks = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await fetchBookById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        await deleteBook({bookId});

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await findBook();

        if (!books) {
            return res.status(404).json({ message: "No books found" });
        }

        res.status(200).json({ message: "Books retrieved successfully", numberOfBooks: books.length, books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await fetchBook({ 
            $or: [{ title: title }, { author: author }]
        });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

