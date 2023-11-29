const express=require("express");
const router=express.Router();
const User=require("../user/User");
const bcript=require("bcryptjs");


router.get("/user",(req,res)=>{
    res.render("user/");
})

//Salvar usuario
router.post("/user/save",(req,res)=>{

    req.session.cadastro.nascimento=req.body.nascimento;
    req.session.cadastro.genero=req.body.genero;
    req.session.cadastro.nome=req.body.nome;

    //Criptografia de dados
    let salt=bcript.genSaltSync(10);
    let senha= bcript.hashSync( req.session.cadastro.senha,salt)

    User.create({
    nome:req.session.cadastro.nome,
    email:req.session.cadastro.email,
    nascimento:req.session.cadastro.nascimento,
    genero:req.session.cadastro.genero,
    senha:senha

}).then(()=>{
    res.redirect("/user")
}).catch(erro=>{
    console.log(erro);
})
})


router.post("/data/complete",(req,res)=>{
    let email = req.body.email;
    let senha= req.body.password;
    req.session.cadastro={
        email,
        senha
    }
    res.render("log/dataProfile");
})

//Rota de registro de alunos
router.get("/register",(req,res)=>{
    res.render("log/register");
});



module.exports=router;