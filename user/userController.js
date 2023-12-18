const express=require("express");
const router=express.Router();
const bcript=require("bcryptjs");

//Tabelas
let User=require("../user/User");
let Cursos=require("../cursos/Cursos");
let UserCurso=require("../UsuariosCurso/Usuarioscursos");
const Aulas = require("../aulas/Aulas");

//Importando o middleware
const auth=require("../middleware/userAuth");

router.get("/user/:id",auth,async (req,res)=>{
    let id=req.params.id;
    let cursos= await Cursos.findAll(); 
    let meucurso= await User.findOne({where:{id:id},include:[{model:Cursos}], through:UserCurso});

    res.render("user/",{
        usuario:meucurso,
        cursos
    });



})

//Salvar usuario
router.post("/data/complete",(req,res)=>{
    let email = req.body.email;
    let senha= req.body.password;
    req.session.cadastro={
        email,
        senha
    }
    res.render("log/dataProfile");
})
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
}).then(async ()=>{
    let usuario= await User.findOne({where:{email:req.session.cadastro.email}});
    req.session.userLogado={usuario}
    res.redirect("/user/"+usuario.id);
}).catch(erro=>{
    console.log(erro);
})
});

router.get("/user/curso/remove/:usuarioId/:cursoId",auth,async (req,res)=>{
    let cursoId=req.params.cursoId;
    let usuarioId=req.params.usuarioId;

    await UserCurso.destroy({where:{cursoId:cursoId}});
    
    res.redirect("/user/"+usuarioId);
})

router.get("/user/curso/add/:cursoId/:userId",auth,async (req,res)=>{
    let cursoId=req.params.cursoId;
    let userId=req.params.userId;

    await UserCurso.create({ cursoId:cursoId, usuarioId:userId });
    res.redirect("/user/"+userId);



})



router.get("/user/curso/:userId/:cursoId",auth,async (req,res)=>{
    let userId=req.params.userId;
    let cursoId=req.params.cursoId;

    let curso= await Cursos.findOne({where:{id:cursoId}, include:[{model:Aulas}]});

    User.findOne({where:{id:userId}}).then(data=>{
        res.render("user/course",{
            usuario:data,
            curso:curso
        })
    }).catch(erro=>{
        res.redirect("/");
    })
    
})


//Rota de registro de alunos
router.get("/register",async (req,res)=>{
    let email= await User.findAll({attributes:["email"]});
    // res.json(email)
    res.render("log/register",{
        email
    });
});

router.get("/userlogout",(req,res)=>{
    req.session.userLogado=undefined;
    res.redirect("/")
})

router.post("/user/delete/acount/:id",auth,async (req,res)=>{
    let id=req.params.id;
    await UserCurso.destroy({where:{usuarioId:id}});
    await User.destroy({where:{id:id}});
    req.session.userLogado = undefined;
    res.redirect("/");
})

module.exports=router;