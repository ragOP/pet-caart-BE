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
 *               salePrice:
 *                 type: number
 *                 description: The sale price of the product
 *               stock:
 *                 type: number
 *                 description: The stock of the product
 *               sku:
 *                 type: string
 *                 description: The SKU of the product
 *               importedBy:
 *                 type: string
 *                 description: The name of the person or entity that imported the product
 *               countryOfOrigin:
 *                 type: string
 *                 description: The country of origin of the product
 *               images:
 *                 type: array
 *                 description: The images of the product
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: The image of the product
 *               variantImages:
 *                 type: array
 *                 description: The variant images of the product
 *                 items:
 *                   type: string
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
 *                 description: Whether the product is an everyday essential
 *               isBestSeller:
 *                 type: boolean
 *                 description: Whether the product is a best seller
 *               isNewleyLaunched:
 *                 type: boolean
 *                 description: Whether the product is newly launched
 *               isAddToCart:
 *                 type: boolean
 *                 description: Whether the product can be added to cart
 *               weight:
 *                 type: number
 *                 description: The weight of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 */

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
 *       - name: collectionSlug
 *         in: query
 *         description: Collection slug
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

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: string
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
 *               salePrice:
 *                 type: number
 *                 description: The sale price of the product
 *               stock:
 *                 type: number
 *                 description: The stock of the product
 *               sku:
 *                 type: string
 *                 description: The SKU of the product
 *               importedBy:
 *                 type: string
 *                 description: The name of the person or entity that imported the product
 *               countryOfOrigin:
 *                 type: string
 *                 description: The country of origin of the product
 *               images:
 *                 type: array
 *                 description: The images of the product
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: The image of the product
 *               variantImages:
 *                 type: array
 *                 description: The variant images of the product
 *                 items:
 *                   type: string
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
 *                 description: Whether the product is an everyday essential
 *               isBestSeller:
 *                 type: boolean
 *                 description: Whether the product is a best seller
 *               isNewleyLaunched:
 *                 type: boolean
 *                 description: Whether the product is newly launched
 *               isAddToCart:
 *                 type: boolean
 *                 description: Whether the product can be added to cart
 *               variantImageMap:
 *                 type: array
 *                 description: Mapping of variant images by index
 *                 items:
 *                   type: object
 *                   properties:
 *                     index:
 *                       type: string
 *                       description: The index of the variant image
 *               variants:
 *                 type: array
 *                 description: The list of product variants
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the variant
 *                     price:
 *                       type: number
 *                       description: The price of the variant
 *                     salePrice:
 *                       type: number
 *                       description: The sale price of the variant
 *                     stock:
 *                       type: number
 *                       description: The stock quantity of the variant
 *                     sku:
 *                       type: string
 *                       description: The SKU of the variant
 *                     weight:
 *                       type: string
 *                       description: The weight of the variant
 *                     attributes:
 *                       type: object
 *                       description: The attributes of the variant
 *                       properties:
 *                         size:
 *                           type: string
 *                         color:
 *                           type: string
 *                         flavor:
 *                           type: string
 *                     isActive:
 *                       type: boolean
 *                       description: Whether the variant is active
 *     responses:
 *       200:
 *         description: Product updated successfully
 */

/**
 * @swagger
 * /api/product/recommendations/{id}:
 *   get:
 *    summary: Get recommended products
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the product
 *        schema:
 *          type: string
 *      - in: query
 *        name: type
 *        description: The type of recommendation (e.g., "related", "similar")
 *        required: false
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A list of recommended products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *      404:
 *        description: Product not found
 *      500:
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/product/delete/{id}:
 *  delete:
 *   summary: Delete a product by ID
 *   tags: [Product]
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: The ID of the product
 *       schema:
 *         type: string
 * responses:
 *   200:
 *     description: Product deleted successfully
 *   404:
 *     description: Product not found
 *   500:
 *     description: Internal server error
 */

/**
 * @swagger
 * /api/product/get-single-product/slug/{slug}:
 *   get:
 *     summary: Get a single product by slug
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */