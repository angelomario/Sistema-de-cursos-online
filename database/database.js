const sequelize=require("sequelize");

const connection= new sequelize("onlineacademy","root","",{
    host:"localhost",
    dialect:"mysql"
});


module.exports= connection;