const express=require("express");
const fs=require("fs-extra");
const multer=require("multer");
const router=express.Router();

const folder="public/upload/cursos/";


//Receber arquivo com multer
const storage=multer.diskStorage({
    destination: function(req,arquive,cb){
        cb(null,folder);
    },
    filename:function(req,arquive,cb){
        cb(null,arquive.originalname)
    }
})
const upload= multer({storage})


router.post("/curso/save",upload.single("file"),(req,res)=>{

    let titulo=req.body.titulo;
    let file=req.body.file;
    
    if(!fs.existsSync(folder+titulo)){
        fs.mkdirSync(folder+titulo)
    }
    
    let ver={
        titulo:titulo,
        file:file
    }
    console.log(ver)
    res.json(ver)
})

router.get("/admin",(req,res)=>{
    res.render("admin/");
})

module.exports=router;