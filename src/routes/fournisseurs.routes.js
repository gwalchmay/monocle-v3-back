const router = require('express').Router();
const { connection } = require('../../connection');
const passport = require('../../helpers/passport');

// récupération de tous les fournisseurs montures
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM fournisseur ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des fournisseurs de montures');
        } else {
            res.json(results);
        }
    });
});

// récupération d'un fournisseur monture
router.get('/:fournisseur', (req, res) => {
    const idFournisseur = req.params.fournisseur;
    connection.query('SELECT * FROM fournisseur WHERE fournisseur.id=?', idFournisseur, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération du fournisseur');
        } else {
            res.json(results[0]);
        }
    });
});

// modification d'un fournisseur monture
router.put('/:fournisseurId', passport.authenticate('jwt-admin', { session: false }), (req, res) => {
    const formData = {
        id: req.params.fournisseurId,
        nom: req.body.nom,
        adresse_rue_1 : req.body.adresse_rue_1,
        adresse_rue_2 : req.body.adresse_rue_2,
        adresse_code_postal : req.body.adresse_code_postal,
        adresse_ville : req.body.adresse_ville,
        adresse_pays : req.body.adresse_pays,
        telephone : req.body.telephone,
        fax : req.body.fax,
        email : req.body.email,
        site_internet : req.body.site_internet
    };
    connection.query('REPLACE INTO fournisseur SET ?', formData, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});

module.exports = router;