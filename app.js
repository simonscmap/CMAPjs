const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const sqlRoutes = require('./routes/sql');
const catalogRoutes = require('./routes/catalog');


const app = express();
const port = process.env.PORT || 8080;


// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.get('/', (req, res) => {res.send('bar')});
app.use('/user', userRoutes);
app.use('/sql', sqlRoutes);
app.use('/catalog', catalogRoutes);


//all the rest?
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// handle uncaught errors 
app.use((req, res, next) => {
    const error = new Error('Not found!! ' + req.url);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {message: error.message}
    });
});



app.listen(port, ()=>{console.log(`listening on port ${port}`)});





/*


const sp = require('./db/storedProcedure');
let args = {
    spName: 'uspSpaceTime',
    tableName: 'tblPisces_NRT',
    fields: 'PP',
    dt1: '2016-01-01',
    dt2: '2016-01-01',
    lat1: '22',
    lat2: '30',
    lon1: '-178',
    lon2: '-157',
    depth1: '0',
    depth2: '100'
    };
sp.spaceTime(args, (err, data)=>{
if (err) {
console.log(err)
} else {
console.log('pisces');
}

});



const db = require('./db/query');
const query = "SELECT * FROM tblVariables";
db.dbQuery(query, (err, data)=>{
if (err) {
console.log(err)
} else {
console.log(data);
}

});

const usr = require('./models/user');
usr.getUserByUsername('user4', (err, data)=>{
    if (err) {
        console.log(err);
    } else {
        console.log(data.recordset[0].UserName);
    };

});




const db = require('./db/db');
db.dbFetch('select * from tblVariable', (err, data)=>{
    if (err) {
        console.log(err)
    } else {
        console.log(data);
    }
    
})


db.dbFetch('select * from tblUsers', (err, data)=>{
    if (err) {
        console.log(err)
    } else {
        console.log(data);
    }
})
*/





/*

let User = {};
User.firstName = "foo2";
User.lastName = "req.body.lastName";
User.userName = "req.body.userName";
User.password = "req.body.password";
User.email = "req.body.email";

const usr = require('./models/user');
console.log(usr.addUser(User));
*/