// CONFIG DB
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt')
const TripModel = require('../models/tripModel')
const UserModel = require('../models/userModel')
const RoleModel = require('../models/roleModel')
const mockTrips = require('./trips');
const mockUsers = require('./users');
const reviewModel = require('../models/reviewModel');
const env = process.env.NODE_ENV;
const config = require('../configs/db-config.json')[env];


// Option: Passing parameters separately (other dialects)
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false
});

const Trip = TripModel(sequelize);
const User = UserModel(sequelize);
const Role = RoleModel(sequelize);
const Review = reviewModel(sequelize);

// Par défaut, tous les utilisateurs créés sont "user"
Role.hasMany(User, {
    foreignKey: {
        defaultValue: 3,
    },
});
User.belongsTo(Role);

User.hasMany(Trip)
Trip.belongsTo(User)

Trip.hasMany(Review, {
    foreignKey: {
        allowNull: false,
    },
})
Review.belongsTo(Trip)

User.hasMany(Review, {
    foreignKey: {
        allowNull: false,
    },
})
Review.belongsTo(User)

const resetDb = process.env.NODE_ENV === "development"

sequelize.sync({ force: resetDb })
    .then(() => {
        mockTrips.forEach(trip => {
            Trip.create(trip)
                .then()
                .catch(error => {
                    console.log(error)
                })
        })

        Role.create({ id: 1, label: "superadmin" })
        Role.create({ id: 2, label: "admin" })
        Role.create({ id: 3, label: "user" })

        mockUsers.forEach(async user => {
            const hash = await bcrypt.hash(user.password, 10)
            user.password = hash
            User.create(user)
                .then()
                .catch(error => {
                    console.log(error)
                })
        })
    })
    .catch((error) => {
        console.log(error)
    })

sequelize.authenticate()
    .then(() => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

module.exports = { sequelize, Trip, User, Role, Review }