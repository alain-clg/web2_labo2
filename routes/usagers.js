const express = require('express');
const router = express.Router();

router.get('/login', (requete, reponse) => reponse.render('login'));
router.get('/register', (requete, reponse) => reponse.render('register'));

router.post('/login', (requete, reponse) => {
    // console.log(requete.body);
    const { email, password } = requete.body;
    let erreurs = [];
    // console.log(email, password);

    if (!email || !password) {
        erreurs.push( { msg: 'Remplir tous les champs' } );
    }

    reponse.send('salut le post a fonctionne');
});
router.post('/register', (requete, reponse) => {
    // console.log(requete.body);
    const { nom, email, password, password2 } = requete.body;
    let erreurs = [];

    if (!nom || !email || !password || !password2) {
        erreurs.push( { msg: 'Remplir tous les champs' } );
    }
    if (password != password2) {
        erreurs.push( { msg: 'Les mots de passe ne sont pas identiques'});
    }
    if (password.length < 6) {
        erreurs.push( { msg: 'Le mot de passe doit etre de 6 car minimum'});
    }
    if (erreurs.length > 0) {
        reponse.render('register', {
            erreurs
        });
    } else {
        reponse.send('tout est beau dans le post du register');
    }

    
});
module.exports = router;