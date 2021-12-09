const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// format des post
app.use(express.urlencoded({ extended: false }));

// les sessions express
app.use(session({
    secret: 'trucmachinBidule',
    resave: true,
    saveUninitialized: true
}));

// pour passport
app.use(passport.initialize());
app.use(passport.session());

// connexion a flash
app.use(flash());

// nos variables globales
app.use((requete, reponse, next) => {
    reponse.locals.succes_msg = requete.flash('succes_msg');
    reponse.locals.erreur_msg = requete.flash('erreur_msg');
    reponse.locals.erreur_passeport = requete.flash('error');
    next();
});

// mes routes...
app.use('/', require('./routes/index'));
app.use('/usagers', require('./routes/usagers'));

// mes vues....
app.set('views', './views');
app.set('layout', 'layout');
app.set('view engine', 'ejs');

// mes fichiers statiques
app.use('/css', express.static('./statique/css'));
app.use('/images', express.static('./statique/images'));
app.use('/javascript', express.static('./statique/javascript'));

// connexion BD
// mongoose.connect('mongodb://localhost/labo02');
mongoose.connect('mongodb+srv://test:test@cluster0.yml6m.mongodb.net/SERVICES_TP1?retryWrites=true&w=majority');

let db = mongoose.connection;
db.on('error', (err) => { console.error('erreur de BD:', err)});
db.once('open', () => {console.log('connexion a la BD OK!!')});

app.listen(PORT, console.log(`Service Web demarre sur le port ${PORT}`));