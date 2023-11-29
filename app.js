const express=require("express");
const sequelize = require("sequelize");
const connection=require("./database/database");
const bodyParser=require("body-parser");
const session=require("express-session");
const app=express();

//Routers
const usercontroller=require("./user/userController");
const admincontroller=require("./admin/adminControler");

//Tabelas
const Admin = require("./admin/Admin");
const User=require("./user/User");
const Cursos=require("./cursos/Cursos");
const Aulas=require("./aulas/Aulas");
const Usuarioscursos=require("./UsuariosCurso/Usuarioscursos");


//Sincronizar todas as tabelas e relacionamentos
//Relacionamento 1-N
Aulas.hasMany(Cursos);
Cursos.belongsToMany(User,{through:Usuarioscursos, as:"cursos"});
User.belongsToMany(Cursos,{through:Usuarioscursos,as:"usuarios"});

Promise.all([Aulas.sync({force:false}),Cursos.sync({force:false}),User.sync({force:false}),Admin.sync({force:false}),Usuarioscursos.sync({force:false})]);


//Configurar o sessio
app.use(session({
    secret:"blslblbldsa",
    cookie:{
        maxAge:1000*60*60*24*7
    }
}));

//Autenticação
connection.authenticate().then(()=>{
    console.log("Conexão bem sucedida!");
}).catch((erro)=>{
    console.log(erro);
})

//Configurar o uso de arquivos estaticos
app.use(express.static("public"));

//Configurando o body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//View engine
app.set("view engine","ejs");


//Rotas

//Rotas externas
app.use("/",usercontroller);
app.use("/",admincontroller);

app.get("/",(req,res)=>{
    res.render("index");
})

//Rota de Login
app.get("/login",(req,res)=>{
    res.render("log/login");
})



app.listen(8080,(erro)=>{
    (!erro)?console.log("Rodando na porta 8080"):console.log(erro);
})