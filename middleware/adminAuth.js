function adminAuth(req,res,next){
    if(req.session.adminLogado != undefined){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports= adminAuth;