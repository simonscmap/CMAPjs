const handleCustomQuery = require('../dbHandlers/handleCustomQuery');

module.exports.stream = async function(req, res, next){
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    });

    handleCustomQuery("SELECT lat, lon FROM tblSeaFlow", res)   
}

module.exports.sync = async function(req, res, next){
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    });

    handleCustomQuery("SELECT lat, lon FROM tblSeaFlow", res)   
}