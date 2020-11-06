const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de toutes les mutuelles
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM mutuelle ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

// récupération d'une mutuelle
router.get('/:mutuelle', (req, res) => {
    const idFournisseur = req.params.mutuelle;
    connection.query('SELECT * FROM mutuelle WHERE mutuelle.id=?', idFournisseur, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results[0]);
        }
    });
});

module.exports = router;