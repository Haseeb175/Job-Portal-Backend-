const express = require('express');
const { registerController, loginUserController } = require('../controllers/authController');
const userAuthMiddlerware = require('../middleware/authMiddleware');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example : DHSASDHJDJHVAJDSVJAVSD
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password should be greater then 6 character
 *        location:
 *          type: string
 *          description: user location city or country
 *      example:
 *        id: GDHJGD788BJBJ
 *        name: abc
 *        email: abc@gmail.com
 *        password: 1234567
 *        location: pakistan
 */



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description : User Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server Error
 */
//route
// Create User || POST
router.post("/register", limiter, registerController)

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *      summary: Login User
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Login Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: Something went Wrong 
 *              
 */

// Login User || POST
router.post("/login", limiter, loginUserController)

module.exports = router