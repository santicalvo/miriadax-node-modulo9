module.exports = function(sequilize, dataTypes){
    return sequilize.define('Quiz',
        {
            pregunta: dataTypes.STRING,
            respuesta: dataTypes.STRING
        })
}