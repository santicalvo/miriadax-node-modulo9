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
    res.render('author', {author: 'Santi'});
};