const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');

router.route('/').get(authorController.getAllAuthors);

router.route('/:id').get(authorController.getOneAuthor);

router.route('/:id/books').get(authorController.getBooksByAuthor);

module.exports = router;
