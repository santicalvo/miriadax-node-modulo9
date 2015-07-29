var models = require('../models/model.js');

//GET /quizes/question
exports.question = function(req, res){
    models.Quiz.findAll().then(function(quizes){
        res.render('quizes/question', {pregunta: quiz[0].pregunta});
    })
};

//GET /
exports.index = function(req, res){
    models.Quiz.findAll().success(function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes});
    });
};

//GET /quizes/question
exports.show = function(req, res){
    models.Quiz
        .find(req.params.quizId)
        .then(function(quiz){
            res.render('quizes/show', {quiz: quiz});
        }
    )
};

//GET /quizes/answers
exports.answer = function(req, res){
    models.Quiz
        .find(req.params.quizId)
        .then(function(quiz){
            if(req.query.respuesta === quiz.respuesta){
                res.render('quizes/answer',
                            {quiz: quiz, respuesta: 'Correcto'});
            }else{
                res.render('quizes/answer',
                            {quiz: quiz, respuesta: 'Incorrecto'});
            }
        }
    );
    /*models.Quiz.findAll().success(function(quiz){
        if(req.query.respuesta === quiz[0].respuesta){
            res.render('quizes/answer', {respuesta: 'Correcto'});
        }else{
            res.render('quizes/answer', {respuesta: 'Incorrecto'});
        }
    })*/
};

//GET /quizes/author
exports.author = function (req, res){
    res.render('author', {author: 'Santi'});
}