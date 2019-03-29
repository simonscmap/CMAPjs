const handleCustomQuery = require('../dbHandlers/handleCustomQuery');
const handleStoredProcedure = require('../dbHandlers/handleStoredProcedure');
const StoredProcedureArgumentSet = require('../models/StoredProcedureArgumentSet');
const errors = require('../utility/errorsStrings');
const logger = require('../utility/logger');


exports.customQuery = (req, res, next)=>{
    // Executes a custom written query on the sql server and returns the result as json.
    const query = req.body.query;
    if (!query) {return res.status(500).json({error: errors.customQueryMissing})};

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    })

    logger.log('info', `Query request from ${req.user.firstName} ${req.user.lastName} at ${req.ip}: ${query}\n`)
    handleCustomQuery(query, res);
};

exports.storedProcedure = (req, res, next)=>{
    // Calls a stored procedure with parameters supplied by the user and returns the result as json.
    const argSet = new StoredProcedureArgumentSet(req.body);
    if(!argSet.isValid()) return res.status(500).json({error: errors.storedProcedureArgumentMissing});

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    })

    logger.log('info', `Stored procedure request from ${req.user.firstName} ${req.user.lastName} at ${req.ip}: ${JSON.stringify(argSet)}\n`);
    handleStoredProcedure(argSet, res);
};