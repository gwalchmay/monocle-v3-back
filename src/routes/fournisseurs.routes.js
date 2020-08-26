const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de tous les fournisseurs montures
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM fournisseur ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération du panier');
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
            res.status(500).send('Erreur lors de la récupération du panier');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;