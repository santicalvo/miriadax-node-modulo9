var models = require('../models/model.js');

exports.load = function(req, res, next, commentId){
    var loading = false;
    models.Comment.find({
        where: {
            id:Number(commentId)
        }
    }).then(function(comment){
        if(comment){
            req.comment = comment;
            next();
        }else{
            next(new Error('No existe commentId = '+commentId));
        }
    }).catch(function(err){
        next(err);
    })
}

exports.new = function (req, res) {
    res.render('comments/new.ejs', { quizid: req.params.quizId, errors:[] });
};

exports.create = function(req, res){
    var comment = models.Comment.build({
        texto: req.body.comment.texto,
        QuizId: Number(req.params.quizId)
    });
    comment
        .validate()
        .then(function(err){
            if(err){
                res.render('comments/new.ejs', { comment: comment, quizid: req.params.quizId, errors:err.errors});
            } else {
                comment
                .save()
                .then(function(){
                    res.redirect('/quizes/' +req.params.quizId)
                });
            }
        })
        .catch(function(error){
            next(error);
        });
};

exports.publish = function(req, res){
    req.comment.publicado = true;
    req.comment.save({
      fields: ['publicado']
    })
    .then(function(){
        res.redirect('/quizes/'+req.params.quizId);
    }).catch(function(err){
        next(err);
    });
}