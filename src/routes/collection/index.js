const express = require('express');
const {
  handleCreateCollection,
  handleGetAllCollections,
  handleGetSingleCollection,
  handleUpdateCollection,
} = require('../../controllers/collection/index.js');
const { validateCreateCollection } = require('../../validators/collection/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/collection:
 *   post:
 *     summary: Create a collection
 *     tags: [Collection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the collection
 *               slug:
 *                 type: string
 *                 description: The slug of the collection
 *               subCategoryId:
 *                 type: string
 *                 description: The sub category id of the collection
 *               images:
 *                 type: file
 *                 format: binary
 *                 description: The images of the collection
 *               description:
 *                 type: string
 *                 description: The description of the collection
 *               productIds:
 *                 type: array
 *                 description: The product ids of the collection
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Collection created successfully
 */

router
  .route('/')
  .post(
    isAdmin,
    upload.array('images'),
    validateCreateCollection,
    validateRequest,
    handleCreateCollection
  );

/**
 * @swagger
 * /api/collection:
 *   get:
 *     summary: Get all collections
 *     tags: [Collection]
 *     responses:
 *       200:
 *         description: Collections fetched successfully
 */

router.route('/').get(handleGetAllCollections);

/**
 * @swagger
 * /api/collection/{id}:
 *   get:
 *     summary: Get a collection by id
 *     tags: [Collection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the collection
 *     responses:
 *       200:
 *         description: Collection fetched successfully
 */

router.route('/:id').get(isAdmin, handleGetSingleCollection);

/**
 * @swagger
 * /api/collection/{id}:
 *   put:
 *     summary: Update a collection by id
 *     tags: [Collection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the collection
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the collection
 *               slug:
 *                 type: string
 *                 description: The slug of the collection
 *               subCategoryId:
 *                 type: string
 *                 description: The sub category id of the collection
 *               images:
 *                 type: file
 *                 format: binary
 *                 description: The images of the collection
 *               description:
 *                 type: string
 *                 description: The description of the collection
 *               productIds:
 *                 type: array
 *                 description: The product ids of the collection
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Collection updated successfully
 */

router.route('/:id').put(isAdmin, upload.single('images'), handleUpdateCollection);

module.exports = router;
