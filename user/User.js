const connection=require("../database/database");
const sequelize= require("sequelize");
const User= connection.define("usuarios",{
    nome:{
        type: sequelize.STRING

    },
    email:{
        type: sequelize.STRING,
        allowNull:false
    },
    senha:{
        type: sequelize.STRING,
        allowNull:false
    },
    genero:{
        type: sequelize.STRING

    },
    nascimento:{
        type: sequelize.STRING

    }
});

module.exports= User;