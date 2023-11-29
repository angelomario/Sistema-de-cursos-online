const sequelize=require("sequelize");
const connection=require("../database/database");
const Aulas=require("../aulas/Aulas");


const Cursos=connection.define("cursos",{
    titulo:{
        type:sequelize.TEXT,
        allowNull:false
    },
    capa:{
        type:sequelize.TEXT,
        allowNull:false
    },
    slug:{
        type:sequelize.TEXT,
        allowNull:false
    }
})

module.exports= Cursos;