const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de toutes les marques
router.get('/', (req, res) => {
    connection.query('SELECT * FROM marque ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des fournisseurs lentilles');
        } else {
            res.json(results);
        }
    });
});




module.exports = router;