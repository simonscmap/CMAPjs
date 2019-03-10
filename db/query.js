const sql = require('mssql');
const dbConfig = require('../config/dbConfig');




exports.dbQuery =  async (query, callback) => { 
    const err = null
    const result = null;
    try {
        let pool = await new sql.ConnectionPool(dbConfig).connect();
        let result = await pool.query(query);
        callback(err, result);
    } catch (err) {        
        callback(err, result);
        //sql.close();
    }       
};





/*
exports.dbFetch_callback_ =  (query, callback) => {
    sql.connect(dbConfig, function(err){
        if (err){ 
            console.log('Database connection error: ');
            console.log(err);
            return;
        };
        const request = new sql.Request();
        request.query(query, function(err, data){    
                if (err){ 
                console.log('Query error: ');
                console.log(err);
                sql.close();
                return;
            };
           callback(data);
           sql.close();
        });
    });
};




exports.dbFetch_stream = function (query, callback){
    sql.connect(dbConfig, err => {
        if (err){ 
            console.log('Database connection error: ');
            console.log(err);
            return;
        };

        const request = new sql.Request()
        request.stream = true // You can set streaming differently for each request
        request.query(query) // or request.execute(procedure)
    
        request.on('recordset', columns => {
            //callback(columns);
            // Emitted once for each recordset in a query
        })
    
        request.on('row', row => {
            callback(row);
            // Emitted for each row in a recordset
        })
    
        request.on('error', err => {
            // May be emitted multiple times
        })
    
        request.on('done', result => {
            callback(result);
            sql.close();
        })
    })
    
    sql.on('error', err => {
        console.log('Stream error: ');
        console.log(err);
        sql.close();
    })

};

*/