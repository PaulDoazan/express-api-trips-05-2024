/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - name
 *         - UserId
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the trip, auto-generated
 *         UserId:
 *           type: integer
 *           description: The id of the user who owns the trip, auto-generated
 *         name:
 *           type: string
 *           description: The name of your trip
 *         duration:
 *           type: integer
 *           description: The description of your trip
 *         destination:
 *           type: string
 *           description: The destination of your trip
 *         description:
 *           type: string
 *           description: The description of your trip
 *         imageUrl:
 *           type: string
 *           description: The url of the thumbnail your trip
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the trip was added, auto-generated
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the trip was updated, auto-generated
 *       example:
 *         id: 12
 *         name: Oasis Trip
 *         superficy: 300
 *         capacity: 50
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */

const express = require('express')
const router = express.Router()
const {
    findAllTrips,
    createTrip,
    findTripByPk,
    updateTrip,
    deleteTrip,
    findAllTripsRawSQL,
    createTripWithImg,
    searchTrips } = require('../controllers/tripControllers')
const { protect, restrictToOwnUser } = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const { Trip } = require('../db/sequelizeSetup')

router
    .route('/')
    /**
    * @openapi
    * /api/trips:
    *   get:
    *     summary: Get all trips
    *     tags: [Trips]
    *     responses:
    *       200:
    *         description: The list of trips.
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Trip'
    *       500:
    *         description: Some server error 
    */
    .get(findAllTrips)
    /**
    * @openapi
    * tags:
    *   name: Trips
    *   description: The trips managing API
    * /api/trips:
    *   post:
    *     summary: Create a new trip
    *     tags: [Trips]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Trip'
    *     responses:
    *       200:
    *         description: The created trip.
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Trip'
    *       500:
    *         description: Some server error 
    */
    .post(protect, createTrip)

router
    .route('/rawSQL')
    .get(findAllTripsRawSQL)

router
    .route('/withImg')
    .post(protect, multer, createTripWithImg)
router
    .route('/search')
    /**
    * @openapi
    * /api/trips/search:
    *   get:
    *     summary: Get a list of trips that match with search parameters
    *     tags: [Trips]
    *     parameters:
    *        - in: query
    *          name: name
    *          schema:               
    *          type: string
    *          description: The string that could match in any trips name
    *     responses:
    *       200:
    *         description: The trip response by id
    *         contents:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Trip'
    *       404:
    *         description: The trip was not found
    */
    .get(searchTrips)

router
    .route('/:id')
    /**
    * @openapi
    * /api/trips/{id}:
    *   get:
    *     summary: Get the trip by id
    *     tags: [Trips]
    *     parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: string
    *         required: true
    *         description: The trip id
    *     responses:
    *       200:
    *         description: The trip response by id
    *         contents:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Trip'
    *       404:
    *         description: The trip was not found
    */
    .get(findTripByPk)
    /**
    * @openapi
    * /api/trips/{id}:
    *   put:
    *    summary: Update the trip by the id
    *    tags: [Trips]
    *    parameters:
    *      - in: path
    *        name: id
    *        schema:
    *          type: string
    *        required: true
    *        description: The trip id
    *    requestBody:
    *      required: true
    *      content:
    *        application/json:
    *          schema:
    *            $ref: '#/components/schemas/Trip'
    *    responses:
    *      200:
    *        description: The trip was updated
    *        content:
    *          application/json:
    *            schema:
    *              $ref: '#/components/schemas/Trip'
    *      404:
    *        description: The trip was not found
    *      500:
    *        description: Some error happened
    */
    .put(protect, restrictToOwnUser(Trip), updateTrip)
    /**
    * @openapi
    * /api/trips/{id}:
    *  delete:
    *     summary: Remove the trip by id
    *     tags: [Trips]
    *     parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: string
    *         required: true
    *         description: The trip id
    *
    *     responses:
    *       200:
    *         description: The trip was deleted
    *       404:
    *         description: The trip was not found
    */
    .delete(protect, restrictToOwnUser(Trip), deleteTrip)

module.exports = router