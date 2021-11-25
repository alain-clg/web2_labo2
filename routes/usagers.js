const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usagers = require('../modeles/usagers');

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
            erreurs,
            nom,
            email,
            password,
            password2
        });
    } else {
        Usagers.findOne({ email: email }).then(usager => {
            if (usager) {
                erreurs.push({ msg: 'Ce courriel existe deja'});
                reponse.render('register', {
                    erreurs,
                    nom,
                    email,
                    password,
                    password2
                });                
            } else {
                const nouveauUsager = new Usagers({
                    nom,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(password, salt, (err, hache) => {
                        if (err) throw err;
                        // nouveau mot de passe est dans le hache
                        nouveauUsager.password = hache;
                        nouveauUsager.save()
                        .then(user => {
                            console.log(nouveauUsager);
                            // requete.flash(
                            //     'success_msg', 'Vous etes dans la BD et pouvez vous connecter'
                            // );
                            reponse.redirect('/usagers/login');

                        })
                        .catch(err => console.log(err));

                    });
                });
            }
        })
        // faire un hachage du mot de passe

    }

    
});
module.exports = router;