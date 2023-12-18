const express=require("express");
const fs=require("fs-extra");
const multer=require("multer");
const slugfy=require("slugify");
const router=express.Router();
const bcript=require("bcryptjs");

const folder="upload/cursos/";
const folderPoster="upload/poster/";

//Importando o middleware
const auth=require("../middleware/adminAuth");

//Tabelas
const Cursos=require("../cursos/Cursos");
const Aulas=require("../aulas/Aulas");
const Admin=require("../admin/Admin");
const User=require("../user/User");

//Receber com multer
const storage=multer.diskStorage({
    destination: function(req,arquive,cb){
        if(req.params.folder!="poster"){
            cb(null,"public/upload/cursos/"+req.params.folder);
        }else{
            cb(null,"public/upload/"+req.params.folder);
        }
        
    },
    filename:function(req,arquive,cb){
        cb(null,arquive.originalname)
    }
})
const uploadFoto= multer({storage})


router.get("/admin/registe",async (req,res)=>{
    let email= await Admin.findAll({attributes:["email"]});
    res.render("admin/registe/acess",{
        email
    });
})
router.post("/admin/acess/temp",(req,res)=>{
    let email = req.body.email;
    let senha= req.body.password;
    req.session.adminCadastro={
        email,
        senha
    }
    res.render("admin/registe/data");

})

router.post("/admin/save",async (req,res)=>{

    req.session.adminCadastro.nascimento=req.body.nascimento;
    req.session.adminCadastro.genero=req.body.genero;
    req.session.adminCadastro.nome=req.body.nome;

    //Criptografia de dados
    let salt=bcript.genSaltSync(10);
    let senha= bcript.hashSync( req.session.adminCadastro.senha,salt)

    Admin.create({
    nome:req.session.adminCadastro.nome,
    email:req.session.adminCadastro.email,
    nascimento:req.session.adminCadastro.nascimento,
    genero:req.session.adminCadastro.genero,
    senha:senha
}).then(async ()=>{
    let admin= await Admin.findOne({where:{email:req.session.adminCadastro.email}});
    req.session.adminLogado={admin}

    res.redirect("/admin/"+admin.id);
}).catch(erro=>{
    console.log(erro);
    res.redirect("/");
})
})
router.post("/curso/save/:folder/:adminId",auth,uploadFoto.single("file"),(req,res)=>{
    let admin=req.body.adminId
    let caminho=folderPoster+req.body.filename;
    let titulo=req.body.titulo;
    let slug=slugfy(titulo);

    
    if(!fs.existsSync("public/"+folder+titulo)){
        fs.mkdirSync("public/"+folder+titulo);
    }
    console.log({
        titulo:titulo,
        file:caminho
    })
    Cursos.create({
        titulo:titulo,
        capa:caminho,
        slug:slug
    }).then(()=>{
        res.redirect("/admin/"+admin)
    })
    
})

router.get("/admin/curso/aulas/:cursoId/:adminId",auth,(req,res)=>{
    let id=req.params.cursoId;
    let adminId=req.params.adminId;
    Cursos.findOne({where:{id:id}, include:[{model:Aulas}]}).then(async data=>{
        let admin= await Admin.findOne({where:{id:adminId}})
        res.render("admin/aulasCurso",{
            curso:data,
            admin
        });
    }).catch(()=>{
        res.redirect("/");
    })
})
router.post("/aula/remove/:adminId",auth,(req,res)=>{
    let cursoId=req.body.cursoId;
    let aula=req.body.aula;
    let aulaId=req.body.aulaId;
    let adminId=req.params.adminId;

    Aulas.destroy({where:{id:aulaId}}).then(async ()=>{
        
        await fs.remove(aula);
        res.redirect("/admin/curso/aulas/"+cursoId+"/"+adminId);
                
    })

})


router.post("/aula/save/:folder/:adminId",auth,uploadFoto.single("file"),(req,res)=>{
    let titulo=req.body.filename;
    let caminho=folder+req.body.filename;
    let cursoId=req.body.cursoId;
    let slug=slugfy(caminho);
    let adminId=req.params.adminId;
    Aulas.create({
        titulo:titulo,
        slug:slug,
        cursoId:cursoId
    }).then(async ()=>{
        res.redirect("/admin/curso/aulas/"+cursoId+"/"+adminId);
    }).catch(erro=>{
        console.log(erro);
        res.redirect("/")
    })   
    
})

router.post("/cursos/remove/:id", auth,async (req,res)=>{
    let cursoId=req.params.id;
    let adminId=req.body.adminId;
    let curso= await Cursos.findOne({where:{id:cursoId}});
    let titulo = curso.titulo;
    let capa = curso.capa;


    Cursos.destroy({where:{id:cursoId}}).then(async ()=>{
        await fs.remove("public/upload/cursos/"+titulo);
        await fs.remove("public/"+capa);
        res.redirect("/admin/"+adminId);
    }).catch(erro=>{
        console.log(erro);
        res.redirect("/login");
    });

})

router.get("/admin/:id",auth,async (req,res)=>{
    let id=req.params.id;
    let usuario= await User.findAll({include:[{model:Cursos}], order:["id"]});
    let aulas=await Aulas.findAll();

    Cursos.findAll({include:[{model:User},{model:Aulas}]}).then(async data=>{
        let admin = await Admin.findOne({where:{id:id}});
        res.render("admin/",{
            cursos:data,
            admin,
            usuario,
            aulas
        });
        // res.json(data)
    })
})
router.post("/admin/delete/acount/:id",auth,async (req,res)=>{
    let id=req.params.id;
    await Admin.destroy({where:{id:id}});
    req.session.adminLogado = undefined;
    res.redirect("/");
})
router.get("/adminlogout",(req,res)=>{
    req.session.adminLogado=undefined;
    res.redirect("/")
})

module.exports=router;