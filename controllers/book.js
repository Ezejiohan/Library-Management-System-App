const { fetchBook, createBook, fetchBookById, deleteBook } = require('../repository/book');

exports.createBook = async (req, res) => {
    try {
        const { title, author_id, isbn, status } = req.body;

        const existingBook = await fetchBook({ isbn });
        if (existingBook) {
            return res.status(400).json({ error: "A book with this ISBN already exists" });
        }

        const book = await createBook({
            title,
            author_id,
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
