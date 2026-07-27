const express = require ('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getReviews,
    createReview,
    deleteReview,
} = require('../controllers/reviewController');

router.get('/:id', authMiddleware, getReviews);
router.post('/', authMiddleware, createReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;