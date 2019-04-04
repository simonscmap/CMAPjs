const handleCustomQuery = require('../dbHandlers/handleCustomQuery');
const handleStoredProcedure = require('../dbHandlers/handleStoredProcedure');
const StoredProcedureArgumentSet = require('../models/StoredProcedureArgumentSet');
const errors = require('../errorHandling/errorsStrings');
const logger = require('../utility/logger');


exports.customQuery = async (req, res, next)=>{
    // Executes a custom written query on the sql server and returns the result as json.
    const query = req.body.query;
    if (!query) {return res.status(500).json({error: errors.customQueryMissing})};

    logger.log('info', `${new Date().toUTCString()}   Query request from ${req.user.firstName} ${req.user.lastName} at ${req.ip}: ${query}\n`)
    await handleCustomQuery(query, res);
    req.cmapApiCallDetails.query = query;
    next();
};

exports.storedProcedure = async (req, res, next)=>{
    // Calls a stored procedure with parameters supplied by the user and returns the result as json.
    const argSet = new StoredProcedureArgumentSet(req.body);
    if(!argSet.isValid()) return res.status(500).json({error: errors.storedProcedureArgumentMissing});

    logger.log('info', `${new Date().toUTCString()}   Stored procedure request from ${req.user.firstName} ${req.user.lastName} at ${req.ip}: ${JSON.stringify(argSet)}\n`);
    await handleStoredProcedure(argSet, res);
    req.cmapApiCallDetails.sprocArgs = JSON.stringify(argSet);
    next();
};