module.exports = function(sequilize, dataTypes){
    return sequilize.define('Quiz',
        {
            pregunta: {
                type:dataTypes.STRING,
                validate: { notEmpty: {msg: "-> Falta pregunta"} }
            },
            respuesta: {
                type:dataTypes.STRING,
                validate: { notEmpty: {msg: "-> Falta pregunta"} }
             }
        })
}