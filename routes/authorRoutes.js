const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');

router.route('/').get(authorController.getAllAuthors);

router.route('/:id').get(authorController.getOneAuthor);

module.exports = router;
