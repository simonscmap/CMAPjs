module.exports = class StoredProcedureArgumentSet{
    constructor(requestBody){
        this.spName = requestBody.spName;
        this.tableName = requestBody.tableName;
        this.fields = requestBody.fields;
        this.dt1 = requestBody.dt1;
        this.dt2 = requestBody.dt2;
        this.lat1 = requestBody.lat1;
        this.lat2 = requestBody.lat2;
        this.lon1 = requestBody.lon1;
        this.lon2 = requestBody.lon2;
        this.depth1 = requestBody.depth1;
        this.depth2 = requestBody.depth2;
    }

    // Returns false if any properties are missing. Should perform a more
    // detailed validation in future versions.
    isValid(){ 
        return !Object.getOwnPropertyNames(this).some(property => {
            return !this[property];
        })
        // && nextTest
        // && nextTest
    }
}