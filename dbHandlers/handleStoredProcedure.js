const sql = require('mssql');
const dbConfig = require('../config/dbConfig');
const JsonTransformStream = require('../models/JsonTransformStream');

// Calls stored named procedure with the supplied parameters, and streams response to client.
module.exports =  async (argSet, res) => { 
    let pool = await new sql.ConnectionPool(dbConfig.dataRetrievalConfig).connect();
    let request = await new sql.Request(pool);

    let jsonTransformStream = new JsonTransformStream(res);

    request.pipe(jsonTransformStream);
    request.input('tableName', sql.NVarChar, argSet.tableName);
    request.input('fields', sql.NVarChar, argSet.fields);
    request.input('dt1', sql.NVarChar, argSet.dt1);
    request.input('dt2', sql.NVarChar, argSet.dt2);
    request.input('lat1', sql.NVarChar, argSet.lat1);
    request.input('lat2', sql.NVarChar, argSet.lat2);
    request.input('lon1', sql.NVarChar, argSet.lon1);
    request.input('lon2', sql.NVarChar, argSet.lon2);
    request.input('depth1', sql.NVarChar, argSet.depth1);
    request.input('depth2', sql.NVarChar, argSet.depth2);

    request.execute(argSet.spName);
    request.on('error', err => res.status(500).json({error:err}));
};


