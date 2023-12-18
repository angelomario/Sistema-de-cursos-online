const connection=require("../database/database");
const sequelize= require("sequelize");
const Usuarioscursos= connection.define("usuarioscursos",{
    id:{
        type: sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
});


module.exports= Usuarioscursos;