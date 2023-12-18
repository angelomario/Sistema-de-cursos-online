function userAuth(req,res,next){
    if(req.session.userLogado != undefined){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports= userAuth;