const express = require('express');
const { getCart, addToCart, deleteCart, handleGetAllAbondendCart } = require('../../controllers/cart/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index.js');
const { isUser, isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();

router.get('/', isUser, validateRequest, getCart);
router.post('/', isUser, validateRequest, addToCart);
router.delete('/:id', isUser, validateRequest, deleteCart);
router.get('/abandoned', isAdmin, validateRequest, handleGetAllAbondendCart);

module.exports = router;
