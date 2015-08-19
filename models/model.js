var path = require('path');
if(!process.env.DATABASE_URL) process.env.DATABASE_URL="sqlite://:@:/";
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name     = (url[6] || null);
var user        = (url[2] || null);
var pwd         = (url[3] || null);
var protocol    = (url[1] || null);
var dialect     = (url[1] || null);
var port        = (url[5] || null);
var host        = (url[4] || null);
var storage     = process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');
//Usar bbdd SQLite
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect:    protocol,
    protocol:   protocol,
    port:       port,
    host:       host,
    storage:    storage, //solo SQLite (.env)
    omitNull:   true     //solo Postgres
});

var localSequelizeDebug = { dialect: 'sqlite',
    protocol: 'sqlite',
    port: null,
    host: null,
    storage: 'quiz.sqlite',
    omitNull: true };

// Poner a false para ejecutar con node sin foreman
var fuckForeman = false;
if(fuckForeman){
    sequelize = new Sequelize(DB_name, user, pwd, localSequelizeDebug);
    console.log("ejecucion local para debugear sin  foreman");
}

//Importar la definición de la tabla en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz; //exportar definición de tabla en Quiz

//squilize.sync crea e inicializa la tabla de preguntas
sequelize.sync().then(function(){
    Quiz.count().then(function(count){
        if(count === 0){ //La tabla se inicializa sólo si está vacía
            Quiz.create({
                pregunta: "Capital de Italia!",
                respuesta: "Roma",
                materia: MAIN_SUBJECTS[0]
            });
            Quiz.create({
                pregunta: "Capital de Portugal",
                respuesta: "Lisboa",
                materia: MAIN_SUBJECTS[0]
            })
            .then( function(f){ console.log("Base de datos inicializada!")} );
        }
    });
});
