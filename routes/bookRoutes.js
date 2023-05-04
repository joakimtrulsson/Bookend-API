const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.route('/').get(bookController.getAllBooks);

router.route('/:id').get(bookController.getOneBook);

module.exports = router;
