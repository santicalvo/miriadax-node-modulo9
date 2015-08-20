//MW de acutorización de accesos http restringidos
exports.loginRequired = function(req, res, next){
    if(req.session.user){
        next();
    } else {
        res.redirect('/login');
    }
}

//Get form de login:
exports.new = function(req, res){
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors:errors});
};

 exports.create = function(req, res){
    var login = req.body.login;
    var password = req.body.password;
    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user){

        if(error){
            req.session.error = {'message': 'Se ha producido un error: '+error.message };
            res.redirect('/login');
            return;
        }

        //Crear req.session.user y guardar campos id y username
        //La sesión se define por la existencia de req.session.user
        req.session.user = {id: user.id, username: user.username}
        if(req.session.redir){
            console.log("------------------redir session")
            res.redirect(req.session.redir.toString()); //redirección a paso antes de login
        } else {
            console.log("------------------redir quizes")
            res.redirect('/quizes');
        }
        //res.redirect(req.session.redir.toString()); //redirección a paso antes de login
    })
};

exports.destroy = function(req, res){
    delete req.session.user;
    if(req.session.redir){
        res.redirect(req.session.redir.toString()); //redirección a paso antes de login
    } else {
        res.redirect('/login');
    }
    return;
}