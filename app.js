var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

global.MAIN_SUBJECTS = ['Otro', 'Humanidades', 'Ocio', 'Ciencia', 'Tecnología'];


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(partials());



app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    //Guardar path en session.redir para después de login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//Comprobamos la última acción para cancelar sesión en dos minutos:

app.use( function(req, res, next) {
    var currentTime = new Date().getTime();
    //Si el usuario se ha dado de alta...
    if(req.session.user){
        var ellapsedTime = (currentTime - req.session.lastAction) / 1000;
        //Si han pasado más de dos minutos cancelamos el usuario
        if(ellapsedTime > 120){
            delete req.session.user;
        }
        console.log("------------han pasado: " + ellapsedTime +" segundos");
    }
    req.session.lastAction = currentTime;
    next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]

        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});
app.locals.inspect = require('util').inspect;

module.exports = app;
