const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');

router.route('/').get(genreController.getAllGenres);

router.route('/:id').get(genreController.getOneGenre);

module.exports = router;
