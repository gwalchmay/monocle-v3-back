const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de tous les fournisseurs lentilles
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM fournisseur_lentille ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des fournisseurs lentilles');
        } else {
            res.json(results);
        }
    });
});

// récupération d'un fournisseur lentilles
router.get('/:fournisseur', (req, res) => {
    const idFournisseur = req.params.fournisseur;
    connection.query('SELECT * FROM fournisseur_lentille WHERE fournisseur_lentille.id=?', idFournisseur, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération du fournisseur lentilles');
        } else {
            res.json(results[0]);
        }
    });
});



module.exports = router;