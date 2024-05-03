const { Op, QueryTypes } = require('sequelize')
const { Trip, sequelize } = require('../db/sequelizeSetup')
const { errorHandler } = require('../errorHandler/errorHandler')

const findAllTrips = async (req, res) => {
    // A l'aide de req.query, on ajoute une fonction de recherche de Trip sur critère du nom
    try {
        const results = await Trip.findAll()
        res.json({ message: `Il y a ${results.length} Trips`, data: results })
    } catch (error) {
        errorHandler(error, res)
    }
}

// On utilise la méthode sequelize.query() pour écrire une requête SQL en dur, SELECT name, rating FROM Trip
const findAllTripsRawSQL = async (req, res) => {
    try {
        const result = await sequelize.query("SELECT name, rating FROM Trips LEFT JOIN reviews ON Trips.id = reviews.TripId", {
            type: QueryTypes.SELECT,
        })
        res.json({ data: result })
    } catch (error) {
        errorHandler(error, res)
    }
}

const searchTrips = async (req, res) => {
    // A l'aide de req.query, on ajoute une fonction de recherche de Trip sur critère du nom
    try {
        const results = await Trip.findAll(
            {
                where:
                    { name: { [Op.like]: `%${req.query.name}%` } }
            }
        )
        res.json({ message: `Il y a ${results.length} Trips`, data: results })

    } catch (error) {
        errorHandler(error, res)
    }
}

const findTripByPk = async (req, res) => {
    try {
        const result = await Trip.findByPk(req.params.id);
        if (!result) {
            return res.status(404).json({ message: `Le Trip n'existe pas` })
        }
        res.json({ message: 'Trip trouvé', data: result })
    } catch (error) {
        errorHandler(error, res)
    }
}

const createTrip = async (req, res) => {
    try {
        req.body.UserId = req.user.id
        const newTrip = await Trip.create(req.body)
        res.status(201).json({ message: `Un Trip a bien été ajouté`, data: newTrip })
    } catch (error) {
        errorHandler(error, res)
    }
}

const createTripWithImg = async (req, res) => {
    console.log(req.protocol, req.get('host'), req.file.filename)
    try {
        req.body.UserId = req.user.id
        req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        const newTrip = await Trip.create(req.body)
        res.status(201).json({ message: `Un Trip a bien été ajouté`, data: newTrip })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateTrip = async (req, res) => {
    try {
        const result = await Trip.findByPk(req.params.id);
        if (!result) {
            return res.status(404).json({ message: `Le Trip n'existe pas` })
        }
        await result.update(req.body)
        res.status(201).json({ message: 'Trip modifié', data: result })
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteTrip = async (req, res) => {
    try {
        const result = await Trip.findByPk(req.params.id);
        if (!result) {
            return res.status(404).json({ message: `Le Trip n'existe pas` })
        }
        result.destroy()
        res.status(200).json({ message: 'Trip supprimé', data: result })
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    findAllTrips,
    createTrip,
    createTripWithImg,
    findTripByPk,
    updateTrip,
    deleteTrip,
    searchTrips,
    findAllTripsRawSQL
}