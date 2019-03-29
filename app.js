const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const dataRetrievalRoutes = require('./routes/dataRetrieval');
const catalogRoutes = require('./routes/catalog');

const app = express();
const port = process.env.PORT || 8080;

const passport = require('./middleware/passport');

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Routes
app.use('/user', userRoutes);
app.use('/dataretrieval', passport.authenticate(['headerapikey', 'jwt'], {session: false}), dataRetrievalRoutes);
app.use('/catalog', passport.authenticate(['headerapikey', 'jwt'], {session: false}), catalogRoutes);
app.use('/authtest', passport.authenticate(['local', 'headerapikey', 'jwt'], {session:false}), (req, res) => res.json(req.user));

//all the rest?
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, ()=>{console.log(`listening on port ${port}`)});