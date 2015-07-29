module.exports = function(sequilize, dataTypes){
    return sequilize.define('Quiz',
        {
            pregunta: dataTypes.STRING,
            respuest: dataTypes.STRING
        })
}