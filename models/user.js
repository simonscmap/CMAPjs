const db = require('../db/query');
const bcrypt = require('bcryptjs');





function queryAddUser(usersTable, User){
    let query = `INSERT INTO ${usersTable} (FirstName, FamilyName, Username, Password, Email) VALUES ('${User.firstName}', '${User.lastName}', '${User.userName}', '${User.password}', '${User.email}')`;
    return query;
};



module.exports.addUser = function (newUser, callback){
    const usersTable = 'tblUsers';
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            const query = queryAddUser(usersTable, newUser);
            db.dbQuery(query, callback);        
        });
    });

};



module.exports.getUserByUsername = function (userName, callback){    
    const usersTable = 'tblUsers';
    userName = userName.trim();
    const query = `SELECT FirstName, FamilyName, UserName, Password, Email FROM ${usersTable} WHERE UserName='${userName}'`;
    db.dbQuery(query, callback);        
};



module.exports.comparePassword = function (passedPassword, hash, callback) {
    bcrypt.compare(passedPassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};