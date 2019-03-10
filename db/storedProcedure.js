const sql = require('mssql');
const dbConfig = require('../config/dbConfig');




exports.spaceTime =  async (args, callback) => { 
    const err = null
    const result = null;
    try {
        let pool = await new sql.ConnectionPool(dbConfig).connect();
        let request = await new sql.Request(pool);
        request.input('tableName', sql.NVarChar, args.tableName);
        request.input('fields', sql.NVarChar, args.fields);
        request.input('dt1', sql.NVarChar, args.dt1);
        request.input('dt2', sql.NVarChar, args.dt2);
        request.input('lat1', sql.NVarChar, args.lat1);
        request.input('lat2', sql.NVarChar, args.lat2);
        request.input('lon1', sql.NVarChar, args.lon1);
        request.input('lon2', sql.NVarChar, args.lon2);
        request.input('depth1', sql.NVarChar, args.depth1);
        request.input('depth2', sql.NVarChar, args.depth2);
        let result = await request.execute(args.spName);
        callback(err, result);
    } catch (err) {        
        callback(err, result);
    }       
};


