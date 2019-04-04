const userDBConfig = require('../config/dbConfig').userTableConfig;
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const userTable = 'tblUsers'
const ApiKeyTable = 'tblApi_Keys'

// Instances of this class contain sensitive information
// and should never be sent to the client directly. See makeSafe
module.exports = class UnsafeUser {

    constructor(userInfo){
        this.firstName = userInfo.firstName || userInfo.FirstName;
        this.lastName = userInfo.lastName || userInfo.FamilyName;
        this.userName = userInfo.userName || userInfo.Username;
        this.password = userInfo.password || userInfo.Password;
        this.email = userInfo.email || userInfo.Email;
        this.id = userInfo.UserID || null;
    }

    static async getUserByUsername(username){
        let pool = await new sql.ConnectionPool(userDBConfig).connect();
        let request = await new sql.Request(pool);
        request.input('username', sql.NVarChar, username);
        request.on('error', err => {throw err});
        let result = await request.query(`SELECT TOP 1 * FROM ${userTable} WHERE username = @username`);
        return result.recordset.length ? result.recordset[0] : false;
    }

    static async getUserByApiKey(key){
        let pool = await new sql.ConnectionPool(userDBConfig).connect();
        let request = await new sql.Request(pool);
        request.input('key', sql.NVarChar, key);
        request.on('error', err => {throw err});
        let result = await request.query(`SELECT TOP 1 * FROM ${userTable} WHERE UserID IN (SELECT User_ID from ${ApiKeyTable} WHERE Api_Key = @key)`);
        return result.recordset.length ? result.recordset[0] : false;
    }    

    makeSafe(){ // Returns user object that can be sent to client
        let safeUser = {
            firstName: this.firstName,
            lastName: this.lastName
        }
        return safeUser;
    }

    async validateNewUser(){
        // if(await this.constructor.getUserByUsername(this.userName)) throw 'This username is already in use.';
        return true;
    }

    async saveAsNew(){ 
        // Validates and saves user to db. 
        
            await this.validateNewUser(); 

            let pool = await new sql.ConnectionPool(userDBConfig).connect();
            let request = await new sql.Request(pool);
            let hashedPassword = await bcrypt.hash(this.password, 10)
            let query = `INSERT INTO ${userTable} (FirstName, FamilyName, Username, Password, Email) VALUES (@firstname, @lastname, @username, @password, @email)`;

            request.input('firstname', sql.NVarChar, this.firstName);
            request.input('lastname', sql.NVarChar, this.lastName);
            request.input('username', sql.NVarChar, this.userName);
            request.input('password', sql.NVarChar, hashedPassword);
            request.input('email', sql.NVarChar, this.email);

            await request.query(query);
    }
}