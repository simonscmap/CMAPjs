const sql = require('mssql');
const dbConfig = require('../config/dbConfig');
const JsonTransformStream = require('../models/JsonTransformStream');

module.exports =  async (query, res) => { 
    let pool = await new sql.ConnectionPool(dbConfig.dataRetrievalConfig).connect();
    let request = await new sql.Request(pool);

    let jsonTransformStream = new JsonTransformStream(res);

    request.pipe(jsonTransformStream);

    request.query(query);
    request.on('error', err => res.status(500).json({error:err}));
};