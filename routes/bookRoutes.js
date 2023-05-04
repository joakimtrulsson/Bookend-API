const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.route('/').get(bookController.getAllBooks);

router.route('/:id').get(bookController.getOneBook);

router.route('/:id/authors').get(bookController.getAuthorsByBook);
router.route('/:id/genres').get(bookController.getGenresByBook);

module.exports = router;
