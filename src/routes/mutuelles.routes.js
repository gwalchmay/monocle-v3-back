const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de toutes les mutuelles
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM mutuelle ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des mutuelles');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;