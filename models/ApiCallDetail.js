const routeMapping = require('../config/routeMapping');

module.exports = class ApiCallDetails{
    constructor(req){
        this.ip = req.ip;
        this.hostName = req.headers.host;
        // this.routeID = routeMapping[req.path];
        this.path = req.path;
    }
}