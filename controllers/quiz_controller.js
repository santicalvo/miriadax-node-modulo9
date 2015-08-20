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
        .findById(quizId, {include: [{ model: models.Comment }]})
        /*findAll({
            where: {id: Number(quizId)},
            include: [{model: models.Comment }]
        })*/
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
        });
};

//GET /
exports.index = function(req, res){
    models.Quiz.findAll()
    .then(function(quizes){
        res.render('quizes/index.ejs', { quizes: quizes, errors:[] });
    })
    .catch(function(er){
        next(er);
    });
};

//GET /quizes/:id
exports.show = function(req, res){
    //res.render('quizes/show', {quiz: req.quiz, errors:[]});
    models.Quiz.findById(req.params.quizId).then(function(quiz) {
	    res.render('quizes/show', { quiz: req.quiz, errors: []})
    })
};

//GET /quizes/answers
exports.answer = function(req, res){
    var resultado = (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) ? "Correcto" : "Incorrecto";
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

// GET /quizes/new
exports.new = function(req, res){
    var quiz = models.Quiz.build({
        pregunta:"",
        respuesta:""
    });
    quiz.subjects = MAIN_SUBJECTS;
    res.render('quizes/new', {quiz: quiz, errors:[]});
};

// GET /quizes/new
exports.create = function(req, res){
    var quiz = models.Quiz.build(req.body.quiz);
    //Guarda en bbdd los campos pregunta y respuesta:
    quiz
        .validate()
        .then(function(err){
            if(err){
                res.render("/quizes/new", {quiz: quiz, errors: err.errors});
            }else{
                quiz
                    .save({fields: ['pregunta', 'respuesta', 'materia']})
                    .then(function(){
                        res.redirect('/quizes');
                    });
            }
        });
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
    var quiz = req.quiz;
    quiz.subjects = MAIN_SUBJECTS;
    res.render('quizes/edit', {quiz: quiz, errors:[]});
};


exports.destroy = function(req, res){
    req.quiz
        .destroy()
        .then(function(err){
            res.redirect('/quizes')
        })
        .catch(function(err){
            next(err);
        });
}

exports.update = function(req, res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.materia = req.body.quiz.materia;
    //res.redirect('quizes');
    // Actualiza en bbdd los campos pregunta y respuesta:
    req.quiz
        .validate()
        .then(function(err){
            if(err){
                res.render("quizes/edit", {quiz: req.quiz, errors: err.errors});
            }else{
                req.quiz
                    .save({fields: ['pregunta', 'respuesta', 'materia']})
                    .then(function(){
                        res.redirect('/quizes');
                    });
            }
        }
    );
};

//GET /quizes/author
exports.author = function (req, res){
    res.render('author', {author: 'Santi', errors: []});
};
//GET /quizes/statistics
exports.statistics = function (req, res, next){
    //Es poco eficiente encontrar todos los datos pero es lo más rápido y no tengo tiempo!!!!
    models.Quiz
        .findAll()
        .then(function(quiz) {
            req.quiz = quiz;
            //res.render('quizes/statistics', {author: 'Santi', errors: []});
            return models.Comment.findAll();
        })
        .then(function(comments){
            req.comments = comments;
            var quizzesId = [];
            var quizLength = req.quiz.length;
            var commentsLength = req.comments.length;
            var cPregsSinComments = 0;
            var cPregsConComments = 0;
            //Guardo todas los quizId
            for (var i=0; i< commentsLength; i++){
                quizzesId.push(req.comments[i].dataValues.QuizId)
            }
            //Cuento todas las preguntas que tienen comentarios
            for (var i=0; i< quizLength; i++){
                if(quizzesId.indexOf(req.quiz[i].dataValues.id) !== -1){
                    cPregsConComments++;
                }
            }
            var stats = {
                cPreguntas: quizLength,
                cComentarios: commentsLength,
                cComentsPregunta: req.comments.length/req.quiz.length,
                cPregsSinComments: quizLength - cPregsConComments,
                cPregsConComments: cPregsConComments,
                errors: []};
            res.render('quizes/statistics', stats);
        })
        .catch(function(err){
            console.log(err);
            next(err);
        })
};