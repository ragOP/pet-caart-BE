const express = require('express');
const {
  handleCreateProduct,
  handleGetAllProducts,
  handleGetSingleProduct,
  handleUpdateProduct,
} = require('../../controllers/product/index.js');
const { validateCreateProduct } = require('../../validators/product/index.js');
const { validateRequest } = require('../../middleware/validateRequest/index');
const multer = require('multer');
const { storage } = require('../../config/multer.js');
const { isAdmin } = require('../../middleware/auth/adminMiddleware.js');
const router = express.Router();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a product
 *     tags: [Product]
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
 *                 description: The name of the product
 *               slug:
 *                 type: string
 *                 description: The slug of the product
 *               description:
 *                 type: string
 *                 description: The description of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               images:
 *                 type: array
 *                 description: The images of the product
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The image of the product
 *                   required: true
 *               variantImages:
 *                 type: array
 *                 description: The variant images of the product
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The variant image of the product
 *               category:
 *                 type: string
 *                 description: The category of the product
 *               brand:
 *                 type: string
 *                 description: The brand of the product
 *               breed:
 *                 type: string
 *                 description: The breed of the product
 *               isEverydayEssential:
 *                 type: boolean
 *                 description: The is everyday essential of the product
 *               isBestSeller:
 *                 type: boolean
 *               isNewleyLaunched:
 *                 type: boolean
 *                 description: The is newley launched of the product
 *               isAddToCart:
 *                 type: boolean
 *                 description: The is add to cart of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 */

router.route('/').post(
  isAdmin,
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'variantImages', maxCount: 100 },
  ]),
  validateRequest,
  handleCreateProduct
);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search by name or slug
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: number
 *       - name: per_page
 *         in: query
 *         description: Number of products per page
 *         required: false
 *         schema:
 *           type: number
 *       - name: start_date
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *       - name: end_date
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *       - name: max_price
 *         in: query
 *         description: Maximum price
 *         required: false
 *         schema:
 *           type: number
 *       - name: isEverydayEssential
 *         in: query
 *         description: Is everyday essential
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: isBestSeller
 *         in: query
 *         description: Is best seller
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: newleyLaunched
 *         in: query
 *         description: Is newley launched
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: isAddToCart
 *         in: query
 *         description: Is add to cart
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: categorySlug
 *         in: query
 *         description: Category slug
 *         required: false
 *         schema:
 *           type: string
 *       - name: subCategorySlug
 *         in: query
 *         description: Sub category slug
 *         required: false
 *         schema:
 *           type: string
 *       - name: brandSlug
 *         in: query
 *         description: Brand slug
 *         required: false
 *         schema:
 *           type: string
 *       - name: breedSlug
 *         in: query
 *         description: Breed id
 *         required: false
 *         schema:
 *           type: string
 *       - name: price_range
 *         in: query
 *         description: Price range
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             min_price_range:
 *               type: number
 *             max_price_range:
 *               type: number
 *       - name: sort_by
 *         in: query
 *         description: Sort by
 *         required: false
 *         schema:
 *           type: string
 *           enum: [priceLowToHigh, priceHighToLow, popularity]
 *       - name: rating
 *         in: query
 *         description: Rating
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

router.route('/').get(handleGetAllProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the product
 *         type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 */

router.route('/:id').get(handleGetSingleProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product by id
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the product
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               slug:
 *                 type: string
 *                 description: The slug of the product
 *               description:
 *                 type: string
 *                 description: The description of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               images:
 *                 type: array
 *                 description: The images of the product
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The image of the product
 *               variantImages:
 *                 type: array
 *                 description: The variant images of the product
 *                 items:
 *                   type: file
 *                   format: binary
 *                   description: The variant image of the product
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               breed:
 *                 type: string
 *               isEverydayEssential:
 *                 type: boolean
 *               isBestSeller:
 *                 type: boolean
 *               isNewleyLaunched:
 *                 type: boolean
 *               isAddToCart:
 *                 type: boolean
 *               variantImageMap:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     index:
 *                       type: string
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     salePrice:
 *                       type: number
 *                     stock:
 *                       type: number
 *                     sku:
 *                       type: string
 *                     weight:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: string
 *                         color:
 *                           type: string
 *                         flavor:
 *                           type: string
 *                     isActive:
 *                       type: boolean
 * 
 *     responses:
 *       200:
 *         description: Product updated successfully
 */

router.route('/:id').put(
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'variantImages', maxCount: 100 },
  ]),
  isAdmin,
  validateRequest,
  handleUpdateProduct
);

module.exports = router;
