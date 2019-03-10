const db = require('../db/query');
const dbSP = require('../db/storedProcedure');


exports.customQuery = (req, res, next)=>{
    const query = req.body.query;
    if (!query) {return res.status(500).json({error: "query is missing"})};
    db.dbQuery(query, (err, data) => {
        if (err) {
            return res.status(500).json({error: err});
        } else {
            return res.status(200).json(data.recordsets);
        };
    });
};





exports.storedProcedure = (req, res, next)=>{
    const args = {
        spName: req.body.spName,
        tableName: req.body.tableName,
        fields: req.body.fields,
        dt1: req.body.dt1,
        dt2: req.body.dt2,
        lat1: req.body.lat1,
        lat2: req.body.lat2,
        lon1: req.body.lon1,
        lon2: req.body.lon2,
        depth1: req.body.depth1,
        depth2: req.body.depth2
        };

    if (!args) {return res.status(500).json({error: "required arguments are missing"})};
    dbSP.spaceTime(args, (err, data) => {
        if (err) {
            return res.status(500).json({error: err});
        } else {
            return res.status(200).json(data.recordset);
        };
    });
};


