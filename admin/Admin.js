const connection=require("../database/database");
const sequelize= require("sequelize");

const Admin= connection.define("admins",{
    nome:{
        type: sequelize.STRING,
        allowNull:false
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
        type: sequelize.STRING,
        allowNull:false
    },
    nascimento:{
        type: sequelize.STRING,
        allowNull:false
    }
});

module.exports= Admin;