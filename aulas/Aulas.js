const sequelize=require("sequelize");
const connection=require("../database/database");
const Cursos=require("../cursos/Cursos");



const Aulas=connection.define("aulas",{
    titulo:{
        type:sequelize.TEXT,
        allowNull:false
    },
    slug:{
        type:sequelize.TEXT,
        allowNull:false
    }
})

module.exports= Aulas;