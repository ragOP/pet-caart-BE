/**
 * @swagger
 * tags:
 *   name: HSN Code
 *   description: API endpoints for HSN Code
 */

/**
 * @swagger
 * /api/hsn-code:
 *   get:
 *     summary: Get all HSN codes
 *     tags: [HSN Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: start_date
 *         in: query
 *         description: Start date for filtering
 *         required: false
 *         schema:
 *           type: string
 *       - name: end_date
 *         in: query
 *         description: End date for filtering
 *         required: false
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search by hsn_code or description
 *         required: false
 *         schema:
 *           type: string
 *       - name: is_active
 *         in: query
 *         description: Filter by active status
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: HSN codes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HSNCode'
 *                 total:
 *                   type: number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/hsn-code/{id}:
 *   get:
 *     summary: Get HSN code by ID
 *     tags: [HSN Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: HSN code ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HSN code fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/HSNCode'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/hsn-code:
 *   post:
 *     summary: Create a new HSN code
 *     tags: [HSN Code]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hsn_code:
 *                 type: string
 *               description:
 *                 type: string
 *               cess:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               cgst_rate:
 *                 type: number
 *               sgst_rate:
 *                 type: number
 *               igst_rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: HSN code created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/hsn-code/{id}:
 *   put:
 *     summary: Update HSN code by ID
 *     tags: [HSN Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: HSN code ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hsn_code:
 *                 type: string
 *               description:
 *                 type: string
 *               cess:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               cgst_rate:
 *                 type: number
 *               sgst_rate:
 *                 type: number
 *               igst_rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: HSN code updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/hsn-code/{id}:
 *   delete:
 *     summary: Delete HSN code by ID
 *     tags: [HSN Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: HSN code ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HSN code deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
