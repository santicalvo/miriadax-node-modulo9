var models = require('../models/model.js');


/*
//GET /quizes/question
exports.question = function(req, res){
    models.Quiz.findAll().then(function(quizes){
        res.render('quizes/question', {pregunta: quiz[0].pregunta});
    })
};

*/

// Autoload: factoriza el código si la ruta incluye quizId

exports.load = function(req, res, next, quizId){
    models.Quiz
        .find(quizId)
        .then(function(quiz){
            if(quiz){
                req.quiz = quiz;
                next();
            } else {
                next( new Error("No existe el quizId=: " + quizId) );
            }
        })
        .catch(function(err){
            next(err);
        })
}

//GET /
exports.index = function(req, res){
    models.Quiz.findAll().success(function(quizes){
        res.render('quizes/index.ejs', { quizes: quizes, errors:[] });
    });
};

//GET /quizes/question
exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz, errors:[]});
};

//GET /quizes/answers
exports.answer = function(req, res){
    var resultado = (req.query.respuesta === req.quiz.respuesta) ? "Correcto" : "Incorrecto";
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

// GET /quizes/new
exports.new = function(req, res){
    var quiz = models.Quiz.build({
        pregunta:"Pregunta",
        respuesta:"Respuesta"
    });
    res.render('quizes/new', {quiz: quiz, errors:[]});
};

// GET /quizes/new
exports.create = function(req, res){
    var quiz = models.Quiz.build(req.quiz.body);
    //Guarda en bbdd los campos pregunta y respuesta:
    quiz
        .validate()
        .then(function(err){
            if(err){
                res.render("quizes/new", {quiz: quiz, errors: err.errors, errors:[]});
            }else{
                quiz
                    .save({fields: ['pregunta', 'respuesta']})
                    .then(function(){
                        res.redirect('quizes');
                    });
            }
        });
};

//GET /quizes/author
exports.author = function (req, res){
    res.render('author', {author: 'Santi'});
};