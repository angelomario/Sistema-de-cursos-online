const connection=require("../database/database");
const sequelize= require("sequelize");
const Usuarioscursos= connection.define("usuarioscursos",{
    relacao:{
        type: sequelize.TEXT
    }
});


module.exports= Usuarioscursos;