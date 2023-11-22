const express=require("express");
const bodyParser=require("body-parser");
const app=express();


//Configurar o uso de arquivos estaticos
app.use(express.static("public"));

//Configurando o body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//View engine
app.set("view engine","ejs");


//Rotas
app.get("/",(req,res)=>{
    res.render("index");
})



app.listen(8080,(erro)=>{
    (!erro)?console.log("Rodando na porta 8080"):console.log(erro);
})