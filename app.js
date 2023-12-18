const express=require("express");
const sequelize = require("sequelize");
const connection=require("./database/database");
const bodyParser=require("body-parser");
const session=require("express-session");
const bcript=require("bcryptjs");
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
Cursos.hasMany(Aulas);
Cursos.belongsToMany(User,{through:Usuarioscursos});
User.belongsToMany(Cursos,{through:Usuarioscursos});

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

//Rotas externas
app.use("/",usercontroller);
app.use("/",admincontroller);

app.get("/",async (req,res)=>{
    let usuario= await User.findAll();
    let aulas=await Aulas.findAll();
    Cursos.findAll().then(data=>{
        res.render("index",{
            cursos:data,
            usuario,
            aulas
        });
    })
})

//Rota de Login
app.get("/login",(req,res)=>{
    
    res.render("log/login");
    
})


app.post("/auth",async (req,res)=>{
    let email=req.body.email;
    let senha=req.body.password;

    let usuario= await User.findOne({where:{email:email}});
    let admin= await Admin.findOne({where:{email:email}});

        if(usuario != undefined){
            let correctUser = bcript.compareSync(senha,usuario.senha);
            if((usuario.email==email)&&correctUser){
                req.session.userLogado={usuario}
                    res.redirect("/user/"+usuario.id);
           }else{
                adminAuth();
            }
        }else{
            adminAuth();
       }

       function adminAuth(){
                if(admin != undefined){
                    let correctAdmin = bcript.compareSync(senha,admin.senha);
                        if((admin.email==email) && correctAdmin){
                            req.session.adminLogado={admin}
                            // res.json(req.session.adminLogado)
                            res.redirect("/admin/"+admin.id);
                        }else{
                            res.redirect("/login");
                        }
            }else{
                res.redirect("/login");
            }
       }
    
})



app.listen(8080,(erro)=>{
    (!erro)?console.log("Rodando na porta 8080"):console.log(erro);
})