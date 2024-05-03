const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Trip',
        {
            // Model attributes are defined here
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        msg: "Le nom doit avoir un nombre de caractères compris entre 3 et 50.",
                        args: [3, 50]
                    }
                },
            },
            duration: {
                type: DataTypes.INTEGER,
            },
            destination: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            imageUrl: {
                type: DataTypes.STRING,
            },
        },
        {
            onDelete: 'CASCADE'
            // Other model options go here
        },
    );
}
