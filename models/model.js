var path = require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');
//Usar bbdd SQLite
var sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite', storage: 'quiz.sqlite'
});

//Importar la definición de la tabla en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz; //exportar definición de tabla en Quiz

//squilize.sync crea e inicializa la tabla de preguntas
sequelize.sync().success(function(){
    Quiz.count().success(function(count){
        console.log("count: "+count);
        if(count === 0){ //La tabla se inicializa sólo si está vacía
            Quiz.create({
                pregunta: "Capital de Italia",
                respuesta: "Roma"
            })
            .success( function(f){ console.log("Base de datos inicializada!")} );
        }
    })
});
