const express=require("express");
const fs=require("fs-extra");
const multer=require("multer");
const Cursos=require("../cursos/Cursos");
const router=express.Router();

const folder="upload/cursos/";
const folderPoster="upload/poster/";


//Receber arquivo com multer
const storage=multer.diskStorage({
    destination: function(req,arquive,cb){
        cb(null,"public/"+folderPoster);
    },
    filename:function(req,arquive,cb){
        cb(null,arquive.originalname)
    }
})
const upload= multer({storage})


router.post("/curso/save",upload.single("file"),(req,res)=>{
    let caminho=req.body.filename;
    let titulo=req.body.titulo;

    
    if(!fs.existsSync("public/"+folder+titulo)){
        fs.mkdirSync("public/"+folder+titulo);
    }
    console.log({
        titulo:titulo,
        file:folderPoster+caminho
    })
    res.json({
        titulo:titulo,
        file:folderPoster+caminho
    })
})

router.get("/admin",(req,res)=>{
    res.render("admin/");
})

module.exports=router;