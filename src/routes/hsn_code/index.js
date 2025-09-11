const express = require('express');
const router = express.Router();

const HsnCodeController = require('../../controllers/hsn_code/index');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest');

router.get('/', isAdmin, validateRequest, HsnCodeController.getAllHSNCodes);
router.get('/:id', isAdmin, validateRequest, HsnCodeController.getHSNById);
router.post('/', isAdmin, validateRequest, HsnCodeController.createHSNCode);
router.put('/:id', isAdmin, validateRequest, HsnCodeController.updateHSNCode);
router.delete('/:id', isAdmin, validateRequest, HsnCodeController.deleteHSNCode);

module.exports = router;
