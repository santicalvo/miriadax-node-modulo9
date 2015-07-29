var models= require('../models/model.js');

//GET /quizes/question
exports.question = function(req, res){
    models.Quiz.findAll().success(function(quiz){
        res.render('quizes/question', {pregunta: quiz[0].pregunta});
    })
};

//GET /quizes/answers
exports.answers = function(req, res){
    models.Quiz.findAll().success(function(quiz){
        if(res.query.respuesta === quiz[0].respuesta){
            res.render('/quizes/answer', {respuesta: 'Correcto'});
        }else{
            res.render('/quizes/answer', {respuesta: 'Incorrecto'});
        }
    })
};