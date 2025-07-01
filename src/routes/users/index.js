const express = require('express');
const {
  handleAllUsers,
  handleGetUserById,
  handleUpdateUser,
} = require('../../controllers/auth/user/index');
const { isAdmin } = require('../../middleware/auth/adminMiddleware');
const { validateRequest } = require('../../middleware/validateRequest/index');
const router = express.Router();

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: The search query
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number
 *       - name: per_page
 *         in: query
 *         required: false
 *         description: The number of users per page
 *       - name: start_date
 *         in: query
 *         required: false
 *         description: The start date
 *       - name: end_date
 *         in: query
 *         required: false
 *         description: The end date
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.route('/all').get(isAdmin, validateRequest, handleAllUsers);

/**
 * @swagger
 * /api/users/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 */
router.route('/user/:id').get(isAdmin, validateRequest, handleGetUserById);

/**
 * @swagger
 * /api/users/user/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user
 *               address:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                       description: The label of the address
 *                     street:
 *                       type: string
 *                       description: The street of the address
 *                     city:
 *                       type: string
 *                       description: The city of the address
 *                     pincode:
 *                       type: string
 *                       description: The pincode of the address
 *                     state:
 *                       type: string
 *                       description: The state of the address
 *                     country:
 *                       type: string
 *                       description: The country of the address
 *                     isDefault:
 *                       type: boolean
 *                       description: The default address of the user
 *                 description: The address of the user
 *               isActive:
 *                 type: boolean
 *                 description: The status of the user
 *               isVerified:
 *                 type: boolean
 *                 description: The verification status of the user
 *               role:
 *                 type: string
 *                 description: The role of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.route('/user/update/:id').put(isAdmin, validateRequest, handleUpdateUser);

module.exports = router;
