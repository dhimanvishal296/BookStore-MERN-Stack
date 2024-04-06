import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

//Route for save a book ******************************************************
router.post('/', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).send({
                message: `Send all required fields: title, author, publishYear`,
            });
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);

        return res.status(201).send(book);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
})

//Route for Get All books from Database ***********************************************
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});

        return res.status(200).json({
            count: books.length,
            data: books
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//Route for getting one book from database by id ***************************************
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        return res.status(200).json(book);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//Route for update a book completely ***************************************************
router.put('/:id', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).send({
                message: 'send all required fields : title, author, publishYear'
            })
        }

        const { id } = req.params;

        const result = await Book.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(400).json({ message: 'Book not found' });
        }
        return res.status(200).send({ message: 'Book updated successfully' });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for partially updating a book ***********************************************
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the book exists
        const existingBook = await Book.findById(id);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update only the provided fields
        const updatedBook = await Book.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true } // Return the modified document, not the original
        );

        return res.status(200).json({ message: 'Book updated successfully', updatedBook });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

//Route for deleting a book ******************************************************
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(400).json({ message: 'Book not found' });
        }
        return res.status(200).json({ message: 'book deleted successfully' });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;
